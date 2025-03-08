export async function handleOAuthCallback(router) {
  try {
    const response = await fetch("/api/callback" + window.location.search);
    if (response.ok) {
      return;
    }
    router.push("/");
  } catch (error) {
    console.error("Error: Redirecting to error page", error);
    router.push("/error");
  }
}