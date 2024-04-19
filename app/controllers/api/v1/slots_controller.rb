class Api::V1::SlotsController < ApplicationController
  before_action :set_slot, only: %i[ show update destroy ]

  # GET /slots
  def index
    if params[:student_id]
      @slots = Slot.available_or_student(params[:student_id])
    else
      @slots = Slot.all
    end
    @slots = @slots.where(coach_id: params[:coach_id]) if params[:coach_id].present?
    render json: @slots, include: :meeting_review
  end

  # GET /slots/1
  def show
    render json: @slot
  end

  # POST /slots
  def create
    @slot = Slot.new(slot_params)

    if @slot.save
      render json: @slot, status: :created, location: @slot
    else
      render json: @slot.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /slots/1
  def update
    if @slot.update(slot_params)
      p @slot
      render json: @slot
    else
      render json: @slot.errors, status: :unprocessable_entity
    end
  end

  # DELETE /slots/1
  def destroy
    @slot.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_slot
      @slot = Slot.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def slot_params
      params.require(:slot).permit(:coach_id, :start_time, :end_time, :student_id, :status)
    end
end
