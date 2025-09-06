# frozen_string_literal: true

module Orders
  class CreateOrderOperation < BaseOperation
    attribute :client_id, :integer
    attribute :title, :string
    attribute :description, :string
    attribute :estimated_cycles, :integer
    attribute :priority, :string, default: 'medium'
    attribute :deadline, :date
    attribute :created_via, :string
    attribute :external_reference, :string
    attribute :price, :decimal
    attribute :admin_user

    validates :client_id, :title, :deadline, :admin_user, presence: true
    validates :estimated_cycles, numericality: { greater_than: 0 }, allow_nil: true
    validates :priority, inclusion: { in: OrderQueue.priorities.keys }

    private

    def execute
      client = User.clients.find(client_id)

      order = OrderQueue.new(
        client: client,
        title: title,
        description: description,
        estimated_cycles: estimated_cycles,
        priority: priority,
        deadline: deadline,
        created_via: created_via,
        external_reference: external_reference,
        price: price
      )

      if order.save
        # Создаем уведомление для клиента
        create_client_notification(order)

        # Создаем первый пак циклов если указано количество циклов
        create_initial_cycle_pack(order) if estimated_cycles&.positive?

        order
      else
        failure(order.errors.full_messages)
      end
    end

    def create_client_notification(order)
      Notifications::CreateNotificationOperation.call(
        user: order.client,
        notification_type: 'order_created',
        title: 'New Order Created',
        message: "Your order \"#{order.title}\" has been created and added to the queue.",
        metadata: { order_id: order.id }
      )
    end

    def create_initial_cycle_pack(order)
      CyclePack.create!(
        order: order,
        pack_number: 1,
        cycles_in_pack: [estimated_cycles, 14].min, # Максимум 14 циклов в паке
        status: 'pending'
      )
    end
  end
end
