export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/api/pet" alt="Commit streak pet" width={330} height={330} />
    </main>
  );
}