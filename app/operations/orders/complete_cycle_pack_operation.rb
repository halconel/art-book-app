# frozen_string_literal: true

module Orders
  class CompleteCyclePackOperation < BaseOperation
    attribute :cycle_pack_id, :integer
    attribute :admin_user
    attribute :notes, :string
    attribute :cycles_actually_completed, :integer

    validates :cycle_pack_id, :admin_user, presence: true
    validates :cycles_actually_completed, numericality: { greater_than: 0 }, allow_nil: true

    private

    def execute
      cycle_pack = CyclePack.find(cycle_pack_id)

      return failure(['Cycle pack is not in progress']) unless cycle_pack.in_progress?

      # Обновляем пак циклов
      cycle_pack.update!(
        status: 'completed',
        completed_at: Time.current,
        notes: notes,
        cycles_in_pack: cycles_actually_completed || cycle_pack.cycles_in_pack
      )

      # Обновляем календарь рабочих нагрузок
      update_workload_calendar(cycle_pack)

      # Создаем уведомление для клиента
      create_completion_notification(cycle_pack)

      # Проверяем, нужно ли создать следующий пак
      create_next_cycle_pack_if_needed(cycle_pack)

      cycle_pack
    end

    def update_workload_calendar(cycle_pack)
      return unless cycle_pack.started_at && cycle_pack.completed_at

      work_days = (cycle_pack.started_at.to_date..cycle_pack.completed_at.to_date).to_a
      cycles_per_day = (cycle_pack.cycles_in_pack.to_f / work_days.length).ceil

      work_days.each do |date|
        calendar_entry = WorkloadCalendar.find_or_create_by(date: date) do |entry|
          entry.cycles_completed = 0
          entry.is_personal_project = false
          entry.intensity_level = 0
        end

        calendar_entry.update!(
          cycles_completed: calendar_entry.cycles_completed + cycles_per_day,
          is_personal_project: false,
          notes: "Work on #{cycle_pack.order.title} (Pack ##{cycle_pack.pack_number})"
        )
      end
    end

    def create_completion_notification(cycle_pack)
      Notifications::CreateNotificationOperation.call(
        user: cycle_pack.client,
        notification_type: 'cycle_pack_completed',
        title: 'Cycle Pack Completed',
        message: "Cycle pack ##{cycle_pack.pack_number} for your order \"#{cycle_pack.order.title}\" has been completed.",
        metadata: {
          cycle_pack_id: cycle_pack.id,
          order_id: cycle_pack.order.id,
          pack_number: cycle_pack.pack_number
        }
      )
    end

    def create_next_cycle_pack_if_needed(completed_pack)
      order = completed_pack.order
      total_cycles_completed = order.total_cycles_completed

      # Создаем следующий пак если работа не завершена
      if total_cycles_completed < order.estimated_cycles
        remaining_cycles = order.estimated_cycles - total_cycles_completed
        next_pack_cycles = [remaining_cycles, 14].min

        CyclePack.create!(
          order: order,
          pack_number: completed_pack.pack_number + 1,
          cycles_in_pack: next_pack_cycles,
          status: 'pending'
        )
      else
        # Заказ завершен
        order.update!(status: 'completed')
        create_order_completion_notification(order)
      end
    end

    def create_order_completion_notification(order)
      Notifications::CreateNotificationOperation.call(
        user: order.client,
        notification_type: 'order_completed',
        title: 'Order Completed',
        message: "Your order \"#{order.title}\" has been completed successfully!",
        metadata: { order_id: order.id }
      )
    end
  end
end
