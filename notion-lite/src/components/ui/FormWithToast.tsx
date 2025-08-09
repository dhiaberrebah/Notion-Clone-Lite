"use client";

import React from "react";
import { useToast } from "./Toaster";

/**
 * Wraps a server-action form to show optimistic toasts and error toasts.
 * Usage:
 * <FormWithToast success="Saved" action={updateAction}>
 *   <form action={updateAction}>...</form>
 * </FormWithToast>
 */
type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export default function FormWithToast({
  children,
  success = "Saved",
  successDescription,
  error = "Something went wrong",
  errorDescription,
}: {
  children: React.ReactElement<FormProps>;
  success?: string;
  successDescription?: string;
  error?: string;
  errorDescription?: string;
}) {
  const { show } = useToast();

  // Clone child form to intercept onSubmit
  const child = React.Children.only(children);
  // Assume the child is a <form>; if not, just return it.
  // We don't prevent default submission; server action still runs.

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      show({ title: success, description: successDescription, type: "success" });
    } catch (err) {
      show({ title: error, description: errorDescription, type: "error" });
    }
  };

  return React.cloneElement(child, { onSubmit } as FormProps);
}
