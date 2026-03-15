import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "editor_pin_unlocked";
const CORRECT_PIN = "yugi";

function isSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function useEditorPin() {
  const [unlocked, setUnlocked] = useState(isSessionUnlocked);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const submitPin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pin === CORRECT_PIN) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  return { unlocked, pin, setPin, error, submitPin };
}

interface EditorPinGateProps {
  onBack: () => void;
  children: React.ReactNode;
}

export function EditorPinGate({ onBack, children }: EditorPinGateProps) {
  const { unlocked, pin, setPin, error, submitPin } = useEditorPin();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-full max-w-sm px-6 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
          <Lock size={28} className="text-gold/60" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-widest uppercase mb-1">
            Editor Access
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Enter PIN to continue
          </p>
        </div>
        <form onSubmit={submitPin} className="w-full flex flex-col gap-3">
          <Input
            ref={inputRef}
            data-ocid="editor.pin.input"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="text-center tracking-widest text-base"
            autoComplete="off"
          />
          {error && (
            <p
              data-ocid="editor.pin.error_state"
              className="text-center text-xs text-destructive"
            >
              Incorrect PIN
            </p>
          )}
          <Button
            data-ocid="editor.pin.submit_button"
            type="submit"
            className="w-full uppercase tracking-widest text-xs font-bold"
          >
            Unlock
          </Button>
        </form>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-muted-foreground uppercase tracking-wider"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
