import TranslationForm from "@/components/TranslationForm";
import { auth } from "@clerk/nextjs/server";

async function TranslatePage() {

  auth().protect();
  const {userId}=auth();
  if(!userId) throw new Error("User not logged in");

  const languageEndpoint="https://api.cognitive.microsofttranslator.com/languages?api-version=3.0"

  const response = await fetch(languageEndpoint,
    "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0",
    {
      next:{
        revalidate:60*60*24,
     },
    }
  );
  const languages=await response.json();

  return (
    <div>
      {/*TranslationForm*/}
      <TranslationForm/>

      {/*TranslationHistory*/}
    </div>


  )
}

export default TranslatePage