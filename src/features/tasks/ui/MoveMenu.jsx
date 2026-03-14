import { useEffect, useRef, useState } from "react";

function MoveMenu({ task, onMove }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const options = [
        { value: "todo", label: "→ To Do" },
        { value: "inprogress", label: "→ In Progress" },
        { value: "done", label: "→ Done" },
    ].filter(o => o.value !== task.status);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button className="btn-icon" title="Move to…" onClick={() => setOpen(!open)}
                style={{ width: 26, height: 26, fontSize: 13 }}>⇄</button>
            {open && (
                <div style={{
                    position: "absolute", bottom: "calc(100% + 4px)", right: 0,
                    background: "var(--color-surface)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-modal)",
                    padding: "4px", zIndex: 100, minWidth: 140
                }}>
                    {options.map(o => (
                        <button key={o.value} style={{
                            display: "block", width: "100%", textAlign: "left",
                            padding: "6px 10px", fontSize: 12, background: "none",
                            border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
                            color: "var(--color-text-secondary)", fontFamily: "var(--font-body)"
                        }}
                            onMouseEnter={e => e.target.style.background = "var(--color-bg)"}
                            onMouseLeave={e => e.target.style.background = "none"}
                            onClick={() => { onMove(task.id, o.value); setOpen(false); }}>
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MoveMenu;