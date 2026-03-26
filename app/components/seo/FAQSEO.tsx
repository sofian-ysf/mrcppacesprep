// FAQ SEO component - schema is handled in layout.tsx to avoid duplicates

export default function FAQSEO() {
  return (
    <>

      <div className="sr-only" aria-hidden="true">
        <h1>MRCP PACES Exam FAQ | Frequently Asked Questions | MRCPPACESPREP</h1>
        <h2>Everything You Need to Know About the MRCP PACES Pre-Registration Exam</h2>

        <p>
          Find answers to common questions about the MRCP PACES pre-registration exam.
          Learn about exam format, pass rates, preparation tips, costs, and more.
          Expert advice from physicians who recently passed.
        </p>

        <h3>FAQ Categories</h3>
        <ul>
          <li>MRCP PACES Exam Basics - Format, Timing, Topics</li>
          <li>Preparation Strategies - Study Tips, Timelines</li>
          <li>Retake Information - Rules, Wait Times, Success</li>
          <li>International Graduates - OSPAP, Requirements</li>
          <li>Platform Questions - Features, Pricing, Support</li>
        </ul>

        <h3>Common MRCP PACES Questions</h3>
        <ul>
          <li>What is the MRCP PACES exam pass mark?</li>
          <li>How many questions are in the MRCP PACES exam?</li>
          <li>What is the MRCP PACES exam format?</li>
          <li>How long is the MRCP PACES exam?</li>
          <li>What topics are tested?</li>
          <li>How do I register for the MRCP PACES exam?</li>
        </ul>

        <h4>Popular FAQ Searches</h4>
        <ul>
          <li>mrcp paces exam faq</li>
          <li>mrcp paces exam questions answered</li>
          <li>mrcp paces exam information</li>
          <li>mrcp paces exam format explained</li>
          <li>how to pass mrcp paces exam</li>
          <li>mrcp paces exam tips</li>
        </ul>

        <p>
          Keywords: MRCP PACES exam FAQ, frequently asked questions, MRCP PACES exam format, MRCP PACES pass rate,
          MRCP PACES exam topics, how to prepare for MRCP PACES, MRCP PACES retake rules, MRCP PACES exam cost,
          international graduate MRCP PACES, OSPAP exam, MRCP PACES exam timing, 110 questions,
          2.5 hours, SBA questions, EMQ questions, calculation questions
        </p>
      </div>

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
}
