// lib/schema-utils.ts — Shared helpers for JSON-LD structured data.
//
// Schema objects in this codebase are serialized with JSON.stringify
// and injected into <script type="application/ld+json"> via
// dangerouslySetInnerHTML. Any literal "<" inside a string field can
// terminate the surrounding <script> tag early and create an XSS
// vector if the field is ever derived from untrusted input.
//
// escapeJsonLd replaces "<" with its < JavaScript-string escape,
// which is semantically identical to the parser but cannot close the
// script element. This is the standard JSON-LD hardening pattern
// (see https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements).
//
// Use it on every JSON-LD payload, even when inputs look server-controlled.
// If a future contributor wires user content into a schema, the escape
// already protects them; if no untrusted content ever appears, the
// escape is a no-op.

export const escapeJsonLd = (json: string): string =>
    json.replace(/</g, '\\u003c');
