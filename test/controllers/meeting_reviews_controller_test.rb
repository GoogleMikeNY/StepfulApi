require "test_helper"

class MeetingReviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @meeting_review = meeting_reviews(:one)
  end

  test "should get index" do
    get meeting_reviews_url, as: :json
    assert_response :success
  end

  test "should create meeting_review" do
    assert_difference("MeetingReview.count") do
      post meeting_reviews_url, params: { meeting_review: { notes: @meeting_review.notes, rating: @meeting_review.rating, slot_id: @meeting_review.slot_id } }, as: :json
    end

    assert_response :created
  end

  test "should show meeting_review" do
    get meeting_review_url(@meeting_review), as: :json
    assert_response :success
  end

  test "should update meeting_review" do
    patch meeting_review_url(@meeting_review), params: { meeting_review: { notes: @meeting_review.notes, rating: @meeting_review.rating, slot_id: @meeting_review.slot_id } }, as: :json
    assert_response :success
  end

  test "should destroy meeting_review" do
    assert_difference("MeetingReview.count", -1) do
      delete meeting_review_url(@meeting_review), as: :json
    end

    assert_response :no_content
  end
end
