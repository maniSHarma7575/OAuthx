export async function handleOAuthCallback(router) {
  try {
    const response = await fetch("/api/redirect" + window.location.search);
    if (response.ok) {
      router.push("/");
      return;
    }

    router.push("/error");
  } catch (error) {
    console.error("Error: Redirecting to error page", error);
    router.push("/error");
  }
}