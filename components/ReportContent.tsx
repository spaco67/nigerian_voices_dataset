import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

const REPORT_REASONS = [
  'Incorrect translation',
  'Inappropriate content',
  'Technical issue',
  'Other',
] as const;

type ReportReason = typeof REPORT_REASONS[number];

export function ReportContent() {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    
    // TODO: Implement actual report submission
    console.log({ reason, details });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thank You</h3>
        <p className="text-muted-foreground">
          Your report has been submitted and will be reviewed by our team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">What's the issue?</h3>
        <RadioGroup onValueChange={(value) => setReason(value as ReportReason)}>
          {REPORT_REASONS.map((r) => (
            <div key={r} className="flex items-center space-x-2">
              <RadioGroupItem value={r} id={r} />
              <Label htmlFor={r}>{r}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Additional Details</Label>
        <Textarea
          id="details"
          placeholder="Please provide more information about the issue..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!reason}
        className="w-full"
      >
        Submit Report
      </Button>
    </div>
  );
}