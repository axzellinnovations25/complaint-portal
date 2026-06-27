export function TrackComplaintPage() {
  return (
    <section className="workflow-panel" id="track">
      <div>
        <p className="eyebrow">Tracking</p>
        <h2>Reference-based progress lookup</h2>
      </div>
      <p>
        Anonymous complaints stay website-only. Complaints with contact numbers can receive Text.lk SMS
        confirmations and configured status updates through a Supabase Edge Function.
      </p>
    </section>
  )
}
