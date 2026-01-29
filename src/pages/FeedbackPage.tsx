import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StarRating } from '@/components/StarRating';
import { EmptyState } from '@/components/EmptyState';
import { useBooking } from '@/context/BookingContext';
import { getTechnicianById } from '@/data/technicians';
import { Feedback, IssueFlag } from '@/types';

const issueOptions: { value: IssueFlag; label: string }[] = [
  { value: 'no-show', label: 'Technician did not show up' },
  { value: 'late', label: 'Arrived late' },
  { value: 'poor-work', label: 'Poor quality work' },
];

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { currentBooking, addFeedback } = useBooking();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [issueFlag, setIssueFlag] = useState<IssueFlag>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Feedback" backPath="/" />
        <EmptyState
          title="No booking found"
          description="You need to complete a booking before leaving feedback."
          action={{ label: 'Go Home', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const technician = getTechnicianById(currentBooking.technicianId);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const feedback: Feedback = {
      id: `FB-${Date.now()}`,
      bookingId: currentBooking.id,
      rating,
      comment: comment.trim(),
      issueFlag,
      submittedAt: new Date(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    addFeedback(feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Feedback" showBack={false} />
        <div className="container py-12">
          <div className="text-center animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Thank you!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your feedback helps us improve reliability for everyone.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-3 rounded-xl text-base font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <PageHeader title="Leave Feedback" backPath="/confirmation" />

      <div className="container py-6">
        {/* Technician Summary */}
        {technician && (
          <div className="card-trust p-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <img
                src={technician.photoUrl}
                alt={technician.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-foreground">{technician.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Booking: {currentBooking.id}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rating */}
        <div
          className="card-trust p-6 mb-4 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <label className="block text-sm font-medium text-foreground mb-4 text-center">
            How was your experience?
          </label>
          <div className="flex justify-center">
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onChange={(r) => {
                setRating(r);
                setError('');
              }}
            />
          </div>
          {error && (
            <p className="text-center text-sm text-destructive mt-3">{error}</p>
          )}
        </div>

        {/* Comment */}
        <div
          className="mb-4 animate-fade-in"
          style={{ animationDelay: '150ms' }}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 250))}
            placeholder="Share your experience..."
            rows={3}
            className="input-field w-full resize-none"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {comment.length}/250
          </p>
        </div>

        {/* Issue Flag */}
        <div
          className="mb-6 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            Report an issue (optional)
          </label>
          <div className="space-y-2">
            {issueOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setIssueFlag(issueFlag === option.value ? null : option.value)
                }
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  issueFlag === option.value
                    ? 'border-destructive bg-destructive/5 text-destructive'
                    : 'border-border bg-background text-foreground hover:bg-secondary'
                }`}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full btn-primary py-4 rounded-xl text-base font-semibold disabled:opacity-50 animate-fade-in"
          style={{ animationDelay: '250ms' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
