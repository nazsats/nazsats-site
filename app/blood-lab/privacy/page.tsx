import type { Metadata } from "next";

// Google Play will not accept a health app without a privacy policy at a public
// URL, and the URL has to keep working — a dead link is grounds for removal
// later, not just rejection now. It lives here rather than in a doc host so it
// stays under a domain that is already ours.

export const metadata: Metadata = {
  title: "Blood Lab — Privacy Policy",
  description:
    "What Blood Lab collects when you scan a blood report, where it goes, how long it is kept, and how to delete it.",
};

const UPDATED = "16 August 2026";

export default function BloodLabPrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Blood Lab — Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--muted,#6B7280)]">Last updated: {UPDATED}</p>

      <p className="mt-8 leading-relaxed">
        Blood Lab reads a photo or PDF of a blood test and explains what the results
        mean in plain English. Doing that means handling health information, so this
        page sets out exactly what is collected, where it goes, and how to get rid
        of it. It is written to be read, not to be survived.
      </p>

      <Section title="Who we are">
        <p>
          Blood Lab is built and operated by Mohammad Nazrul Ansari, Mumbai, India.
          For any question about this policy or your data, write to{" "}
          <a className="underline" href="mailto:dudelynft@gmail.com">
            dudelynft@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section title="What we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>The report you upload.</strong> The photo or PDF itself, and the
            marker names, values and reference ranges read from it.
          </li>
          <li>
            <strong>Your account.</strong> An email address if you create one. You can
            use Blood Lab without an account for your first report — in that case we
            hold only an anonymous identifier, not your identity.
          </li>
          <li>
            <strong>Details you choose to enter.</strong> Age, blood type, current
            medications and existing conditions. These are optional; they make the
            explanation more accurate.
          </li>
          <li>
            <strong>Basic technical data.</strong> Crash and error logs, and counts of
            how many reports an account has analysed, which is how the free allowance
            and rate limits work.
          </li>
        </ul>
      </Section>

      <Section title="What we do not collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>We do not collect your location.</li>
          <li>We do not collect your contacts, messages, photos beyond the report you pick, or advertising identifiers.</li>
          <li>We do not sell your data, and we do not share it with advertisers or data brokers.</li>
        </ul>
      </Section>

      <Section title="Where your report goes">
        <p>
          The report you upload is sent to <strong>OpenAI</strong>, which performs the
          analysis and returns the explanation you read. That transfer is the product;
          without it there is nothing to show you. OpenAI processes the request on our
          behalf as a service provider and, under its API terms, does not use content
          submitted through the API to train its models.
        </p>
        <p className="mt-3">
          Your report and its analysis are stored in <strong>Google Firebase</strong>{" "}
          (Firestore and Authentication) so you can open them again later. Both OpenAI
          and Google process data outside India.
        </p>
        <p className="mt-3">
          Those two, plus our hosting provider, are the only third parties involved.
          There are no analytics or advertising SDKs in the app.
        </p>
      </Section>

      <Section title="Sharing a report">
        <p>
          If you use the share feature, a link is created that lets anyone holding it
          view that report without signing in. That is the point of the feature, but it
          means the link is the only thing protecting it — treat it like the report
          itself and only send it to people you intend to see your results.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          Reports are kept until you delete them, so that your history stays available.
          Delete a report in the app and it is removed from our database. Ask us to
          delete your account and everything tied to it goes, including uploaded files
          and analyses; we will action that within 30 days of your request to the email
          above.
        </p>
      </Section>

      <Section title="Your choices">
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the app without an account for your first report.</li>
          <li>Leave the optional health details blank.</li>
          <li>Delete any report at any time from your history.</li>
          <li>Ask for your account and all associated data to be deleted.</li>
          <li>Ask for a copy of what we hold about you.</li>
        </ul>
      </Section>

      <Section title="Children">
        <p>
          Blood Lab is not intended for anyone under 18, and we do not knowingly
          collect data from children. If you believe a child has used the app, contact
          us and we will delete the account.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Traffic is encrypted in transit. Reports are readable only by the account
          that created them, enforced by database rules rather than by the app alone.
          No system is perfect, and we will tell affected users promptly if we ever
          discover a breach involving health data.
        </p>
      </Section>

      <Section title="This is not medical advice">
        <p>
          Blood Lab explains what your results say. It does not diagnose, treat, or
          replace a doctor, and an AI model can be wrong. Always take decisions about
          your health with a qualified clinician.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes we will update the date at the top, and we will notify
          you in the app before any change that materially affects how your health data
          is handled.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </section>
  );
}
