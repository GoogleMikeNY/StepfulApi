class Api::V1::MeetingReviewsController < ApplicationController
  before_action :set_meeting_review, only: %i[ show update destroy ]

  # GET /meeting_reviews
  def index
    @meeting_reviews = MeetingReview.all

    render json: @meeting_reviews
  end

  # GET /meeting_reviews/1
  def show
    render json: @meeting_review
  end

  # POST /meeting_reviews
  def create
    @meeting_review = MeetingReview.new(meeting_review_params)

    if @meeting_review.save
      render json: @meeting_review, status: :created, location: @meeting_review
    else
      render json: @meeting_review.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /meeting_reviews/1
  def update
    if @meeting_review.update(meeting_review_params)
      render json: @meeting_review
    else
      render json: @meeting_review.errors, status: :unprocessable_entity
    end
  end

  # DELETE /meeting_reviews/1
  def destroy
    @meeting_review.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_meeting_review
      @meeting_review = MeetingReview.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def meeting_review_params
      params.require(:meeting_review).permit(:rating, :notes, :slot_id)
    end
end
