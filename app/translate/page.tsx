import { auth } from "@clerk/nextjs/server";

function TranslatePage() {
  auth().protect();
  const {userId}=auth();
  return (
    <div>TranslatePage:{userId}</div>
  )
}

export default TranslatePage