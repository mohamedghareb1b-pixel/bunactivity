import { prisma } from "@/lib/prisma";
import MarkReadButton from "@/components/admin/MarkReadButton";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {messages.length === 0 ? (
        <p className="opacity-70">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`card p-4 ${m.read ? "opacity-70" : ""}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-semibold">
                    {m.name} <span className="font-normal opacity-60">&lt;{m.email}&gt;</span>
                  </div>
                  {m.subject && <div className="text-sm opacity-80 mt-1">{m.subject}</div>}
                </div>
                <div className="text-xs opacity-60 shrink-0">
                  {m.createdAt.toLocaleString()}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
              {!m.read && <MarkReadButton id={m.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
