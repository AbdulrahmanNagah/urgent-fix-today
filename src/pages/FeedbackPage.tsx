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
  { value: 'no-show', label: 'الصنايعي ما جاش' },
  { value: 'late', label: 'وصل متأخر' },
  { value: 'poor-work', label: 'الشغل مش كويس' },
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
        <PageHeader title="التقييم" backPath="/" />
        <div className="container mt-10">
          <EmptyState
            title="مفيش حجز"
            description="لازم يكون عندك حجز الأول عشان تسيب تقييم."
            action={{ label: 'الرئيسية', onClick: () => navigate('/') }}
          />
        </div>
      </div>
    );
  }

  const technician = getTechnicianById(currentBooking.technicianId);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('لو سمحت اختار تقييم (عدد النجوم)');
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
      <div className="min-h-screen bg-background pb-10">
        <PageHeader title="التقييم" showBack={false} />
        <div className="container py-12 max-w-lg mx-auto">
          <div className="text-center animate-fade-in flex flex-col items-center">
            <div className="inline-flex p-6 rounded-[2rem] bg-success border-4 border-foreground shadow-[0_8px_0_hsl(355,65%,30%)] mb-6">
              <CheckCircle2 className="w-16 h-16 text-background" />
            </div>
            <h2 className="text-4xl font-black text-foreground mb-4">شكراً لك!</h2>
            <p className="text-lg font-bold text-foreground/80 mb-8">
              تقييمك بيساعدنا نحسن الخدمة.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary py-4 px-10 text-xl w-full"
            >
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <PageHeader title="سيب تقييمك" backPath="/confirmation" />

      <div className="container py-8 max-w-lg mx-auto">
        {/* Technician Summary */}
        {technician && (
          <div className="bg-secondary rounded-[1.5rem] border-2 border-foreground p-5 mb-8 shadow-[0_4px_0_hsl(355,65%,30%)] animate-fade-in text-right">
            <div className="flex items-center gap-4 flex-row-reverse">
              <img
                src={technician.photoUrl}
                alt={technician.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-foreground"
              />
              <div className="flex-1 text-right">
                <h3 className="text-xl font-black text-foreground mb-1">{technician.name}</h3>
                <p className="text-sm font-bold text-foreground/80 font-mono">
                  حجز رقم: {currentBooking.id}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rating */}
        <div
          className="bg-background rounded-[2rem] border-2 border-foreground p-8 mb-6 shadow-[0_6px_0_hsl(355,65%,30%)] animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <label className="block text-2xl font-black text-foreground mb-6 text-center">
            رأيك إيه في الصنايعي؟
          </label>
          <div className="flex justify-center flex-row-reverse">
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
            <p className="text-center text-sm font-bold text-destructive mt-4">{error}</p>
          )}
        </div>

        {/* Comment */}
        <div
          className="mb-6 animate-fade-in text-right"
          style={{ animationDelay: '150ms' }}
        >
          <label className="flex items-center justify-end gap-2 text-lg font-bold text-foreground mb-3 flex-row-reverse">
            <MessageSquare className="w-5 h-5 text-primary" />
            تعليقك (اختياري)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 250))}
            placeholder="اكتب رأيك بصراحة..."
            rows={4}
            className="input-field w-full resize-none text-right rounded-3xl"
            dir="rtl"
          />
          <p className="text-sm font-bold text-foreground/80 text-left mt-2 font-mono">
            {comment.length}/250
          </p>
        </div>

        {/* Issue Flag */}
        <div
          className="mb-10 animate-fade-in text-right"
          style={{ animationDelay: '200ms' }}
        >
          <label className="flex items-center justify-end gap-2 text-lg font-bold text-foreground mb-4 flex-row-reverse">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            لو فيه مشكلة بلغنا (اختياري)
          </label>
          <div className="space-y-3">
            {issueOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setIssueFlag(issueFlag === option.value ? null : option.value)
                }
                className={`w-full text-right px-6 py-4 rounded-2xl border-2 transition-all font-bold text-lg ${
                  issueFlag === option.value
                    ? 'border-destructive bg-destructive text-background'
                    : 'border-foreground bg-secondary text-foreground hover:bg-background'
                }`}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full btn-primary py-4 text-xl animate-fade-in"
          style={{ animationDelay: '250ms' }}
        >
          {isSubmitting ? 'بيبعت...' : 'ابعت التقييم'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
