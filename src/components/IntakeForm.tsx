"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { submitIntake, type IntakeState } from "@/app/actions/intake";
import {
  Caption,
  DisplayHeading,
  BodyCopy,
  PrimaryButton,
  TextLink,
} from "./primitives";

const initialState: IntakeState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton
      type="submit"
      pending={pending}
      pendingLabel="Sending…"
      fullWidth
    >
      Book a 30-min call
    </PrimaryButton>
  );
}

export function IntakeForm() {
  const [state, formAction] = useActionState(submitIntake, initialState);

  if (state.status === "ok") {
    return (
      <div role="status" aria-live="polite" className="py-8 text-center">
        <DisplayHeading as="p" size="md" tone="amber" className="mb-3">
          Mission brief received.
        </DisplayHeading>
        <BodyCopy size="base" tone="primary" className="mb-6">
          {state.message}
        </BodyCopy>
        <a
          href="https://cal.com/jjwalker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lamp-amber underline-offset-4 transition-colors duration-200 hover:underline"
        >
          Or book directly →
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Field name="name" label="Name" required autoComplete="name" />
        <Field
          name="email"
          label="Email"
          required
          type="email"
          autoComplete="email"
        />
      </div>
      <Field
        name="company"
        label="Company"
        autoComplete="organization"
      />
      <Field
        name="current_stack"
        label="Current AI stack"
        helperText="(which tools are you using now?)"
      />
      <TextAreaField
        name="mission_brief"
        label="What you want AI to do for your business"
        required
        rows={2}
      />
      {state.status === "error" && (
        <p role="alert" aria-live="polite" className="text-base text-amber-flame">
          {state.message}
        </p>
      )}
      <p className="font-mono text-[0.75rem] text-bone/70 pt-4">
        By submitting, you agree to JJ contacting you about AiOS services. We
        don&rsquo;t share your data.{" "}
        <a
          href="/privacy"
          className="underline-offset-4 transition-colors duration-200 text-bone/70 hover:text-trust-blue"
        >
          Privacy →
        </a>
      </p>
      <SubmitButton />
    </form>
  );
}

const fieldClasses =
  "w-full rounded-md border border-rocket-white/12 bg-rocket-white/5 px-3 py-[8px] text-base text-rocket-white placeholder-rocket-white/40";

type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  helperText?: string;
};

function Field({
  name,
  label,
  required,
  type = "text",
  placeholder,
  autoComplete,
  helperText,
}: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-0.5 block">
        <Caption tone="muted">
          {label} {required && <span aria-hidden="true">*</span>}
          {helperText && (
            <span className="ml-1 opacity-70">{helperText}</span>
          )}
        </Caption>
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={fieldClasses}
      />
    </div>
  );
}

type TextAreaProps = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  helperText?: string;
};

function TextAreaField({
  name,
  label,
  required,
  placeholder,
  rows,
  helperText,
}: TextAreaProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-0.5 block">
        <Caption tone="muted">
          {label} {required && <span aria-hidden="true">*</span>}
          {helperText && (
            <span className="ml-1 opacity-70">{helperText}</span>
          )}
        </Caption>
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={`${fieldClasses} resize-y`}
      />
    </div>
  );
}
