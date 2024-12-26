export function GuidelinesContent() {
  return (
    <div className="space-y-6 text-foreground">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">Recording Environment</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Find a quiet room with minimal background noise</li>
          <li>Avoid spaces with echo or reverb</li>
          <li>Keep a consistent distance from your microphone</li>
          <li>Test your microphone before starting</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">Voice Quality</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Speak clearly and at a natural pace</li>
          <li>Maintain consistent volume throughout</li>
          <li>Pronounce words accurately</li>
          <li>Take breaks if needed to maintain quality</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">Content Guidelines</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Read the phrase exactly as written</li>
          <li>Avoid adding or removing words</li>
          <li>Use natural intonation</li>
          <li>Re-record if you make a mistake</li>
        </ul>
      </section>

      <div className="p-4 bg-muted rounded-lg mt-6">
        <p className="text-sm text-muted-foreground">
          Your contributions help preserve language and culture for future generations.
          Thank you for maintaining high-quality standards!
        </p>
      </div>
    </div>
  );
}