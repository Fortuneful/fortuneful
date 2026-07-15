// Save as:  app/sign-in/[[...sign-in]]/page.jsx
// (create folder "sign-in", inside it a folder literally named "[[...sign-in]]", and this file inside that)
'use client';

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      background: "#0B0B0D", padding: 24,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: "#D9A441",
          display: "grid", placeItems: "center", color: "#141419", fontWeight: 800,
          fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic",
          margin: "0 auto 18px",
        }}>F</div>
        <SignIn
          appearance={{
            variables: { colorPrimary: "#D9A441", colorBackground: "#141419", colorText: "#F2F1EC" },
          }}
          forceRedirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
