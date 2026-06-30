"use server";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const position = formData.get("position");
    const message = formData.get("message");

    // Validate required fields
    if (!name || !email || !message) {
      return { error: "Missing required fields" };
    }

    // TODO: Wire up email sending here
    // For now, just return success to demonstrate form functionality
    console.log("Contact form submission:", {
      name,
      email,
      phone,
      position,
      message,
      submittedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "Failed to submit form" };
  }
}
