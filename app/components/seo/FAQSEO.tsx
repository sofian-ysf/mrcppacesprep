// FAQ SEO component - schema is handled in layout.tsx to avoid duplicates

export default function FAQSEO() {
  return (
    <>

      <div className="sr-only" aria-hidden="true">
        <h1>GPhC Exam FAQ | Frequently Asked Questions | PreRegExamPrep</h1>
        <h2>Everything You Need to Know About the GPhC Pre-Registration Exam</h2>

        <p>
          Find answers to common questions about the GPhC pre-registration exam.
          Learn about exam format, pass rates, preparation tips, costs, and more.
          Expert advice from pharmacists who recently passed.
        </p>

        <h3>FAQ Categories</h3>
        <ul>
          <li>GPhC Exam Basics - Format, Timing, Topics</li>
          <li>Preparation Strategies - Study Tips, Timelines</li>
          <li>Retake Information - Rules, Wait Times, Success</li>
          <li>International Graduates - OSPAP, Requirements</li>
          <li>Platform Questions - Features, Pricing, Support</li>
        </ul>

        <h3>Common GPhC Questions</h3>
        <ul>
          <li>What is the GPhC exam pass mark?</li>
          <li>How many questions are in the GPhC exam?</li>
          <li>What is the GPhC exam format?</li>
          <li>How long is the GPhC exam?</li>
          <li>What topics are tested?</li>
          <li>How do I register for the GPhC exam?</li>
        </ul>

        <h4>Popular FAQ Searches</h4>
        <ul>
          <li>gphc exam faq</li>
          <li>gphc exam questions answered</li>
          <li>pre-reg exam information</li>
          <li>gphc exam format explained</li>
          <li>how to pass gphc exam</li>
          <li>gphc exam tips</li>
        </ul>

        <p>
          Keywords: GPhC exam FAQ, frequently asked questions, GPhC exam format, GPhC pass rate,
          GPhC exam topics, how to prepare for GPhC, GPhC retake rules, GPhC exam cost,
          international graduate GPhC, OSPAP exam, GPhC exam timing, 110 questions,
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
