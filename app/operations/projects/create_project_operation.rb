# frozen_string_literal: true

module Projects
  class CreateProjectOperation < BaseOperation
    attribute :title, :string
    attribute :description, :string
    attribute :thumbnail_url, :string
    attribute :is_personal, :boolean, default: true
    attribute :cycle_pack_id, :integer
    attribute :admin_user

    validates :title, :thumbnail_url, :admin_user, presence: true
    validate :validate_cycle_pack_assignment

    private

    def execute
      project = Project.new(
        title: title,
        description: description,
        thumbnail_url: thumbnail_url,
        is_personal: is_personal,
        cycle_pack_id: cycle_pack_id,
        user: admin_user,
        status: 'draft'
      )

      if project.save
        # Если проект привязан к паку циклов, запускаем пак
        start_cycle_pack_if_needed(project)

        project
      else
        failure(project.errors.full_messages)
      end
    end

    def validate_cycle_pack_assignment
      return if cycle_pack_id.blank?

      cycle_pack = CyclePack.find_by(id: cycle_pack_id)
      return errors.add(:cycle_pack_id, 'does not exist') unless cycle_pack

      errors.add(:cycle_pack_id, 'already has assigned projects') if cycle_pack.projects.any?

      return if cycle_pack.pending?

      errors.add(:cycle_pack_id, 'must be in pending status')
    end

    def start_cycle_pack_if_needed(project)
      return unless project.cycle_pack&.pending?

      project.cycle_pack.start!
      project.update!(status: 'in_progress')
    end
  end
end
