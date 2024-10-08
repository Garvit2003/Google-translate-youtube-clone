"use client";
import translate from "@/actions/translate";
import { TranslationLanguages } from "@/app/translate/page";
 
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Volume2Icon } from "lucide-react";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import Recorder from "./Recorder";
import SubmitButton from "./SubmitButton";
import { Button } from "./ui/button";

const initialState = {
    inputLanguage: "auto",
    input: "",
    outputLanguage: "es",
    output: "",
  };
  
  export type State = typeof initialState;

function TranslationForm({languages}:{languages:TranslationLanguages}) {
    const [state, formAction] = useFormState(translate, initialState);
    const [input, setInput]=useState("");
    const [output, setOutput]=useState("");
    const submitBtnRef = useRef<HTMLButtonElement>(null);

    console.log(state)

    useEffect(() => {
        if (!input?.trim()) return;
    
        const delayDebounceFn = setTimeout(() => {
          submitBtnRef.current?.click();
        }, 500);
    
        return () => clearTimeout(delayDebounceFn);
      }, [input]);

    useEffect(()=>{
        if(state.output){
            setOutput(state.output);
        }
    }, [state]);

    const playAudio = async () => {
        const synth = window.speechSynthesis;
    
        if (!output || !synth) return;
    
        const wordsToSay = new SpeechSynthesisUtterance(output);
    
        synth.speak(wordsToSay);
    };

    // const uploadAudio = async (blob: Blob) => {
    //     const mimeType = "audio/webm";

    //     const file = new File([blob], "audio.webm", { type: mimeType });

    //     const formData = new FormData();
    //     formData.append("audio", file);

    //     const response = await fetch("/transcribeAudio", {
    //         method: "POST",
    //         body: formData,
    //     });

    //     const data = await response.json();

    //     if (data.text) {
    //         setInput(data.text);
    //     }
    // };
    const uploadAudio = async (blob: Blob) => {
        const mimeType = "audio/webm";
        const file = new File([blob], "audio.webm", { type: mimeType });
    
        const formData = new FormData();
        formData.append("audio", file);
    
        try {
            const response = await fetch("/transcribeAudio", {
                method: "POST",
                body: formData,
            });
    
            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Attempt to parse JSON response
            const data = await response.json();
    
            // Check if the expected data is present
            if (data.text) {
                setInput(data.text);
            } else {
                console.error("Response does not contain 'text':", data);
            }
        } catch (error) {
            // If JSON parsing fails, log the error and response text
            if (error instanceof SyntaxError) {
                const text = await response.text(); // Read the response body as text
                console.error("Failed to parse JSON:", error);
                console.error("Response body:", text);
            } else {
                console.error("Error uploading audio:", error);
            }
        }
    };
    


  return (
    <div>
        <form action={formAction}>
        <div className="flex space-x-2">
            <div className="flex items-center group cursor-pointer border rounded-md w-fit px-3 py-2 bg-[#E7F0FE] mb-5">
            <Image
                src="https://links.papareact.com/r9c"
                alt="logo"
                width={30}
                height={30}
            />

            {/* style like a blue google button */}
            <p className="text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1">
                Text
            </p>
            </div>

            {/* <Recorder uploadAudio={uploadAudio} /> */}
            <Recorder uploadAudio={uploadAudio} />

        </div>
            <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
                <div className="flex-1 space-y-2">
                    <Select name="inputLanguage" defaultValue="auto">
                <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Want us to figure out?</SelectLabel>
                        <SelectItem key="auto" value="auto">
                            Auto-detection
                        </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                            <SelectLabel>Language</SelectLabel>
                            {Object.entries(languages.translation).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                {value.name}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                </SelectContent>
                </Select>
                <Textarea
                placeholder="Type your message here."
                className="min-h-32 text-xl"
                name="input"
                value={input}
                onChange={(e) => 
                setInput(e.target.value)
                }
                />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">

                    <Select name="outputLanguage" defaultValue="es">
                <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Want us to figure out?</SelectLabel>
                        <SelectItem key="auto" value="auto">
                            Auto-detection
                        </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                            <SelectLabel>Language</SelectLabel>
                            {Object.entries(languages.translation).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                {value.name}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    type="button"
                    onClick={playAudio}
                    disabled={!output}
                >
                    <Volume2Icon
                    size={24}
                    className="text-blue-599 cursor-pointer disabled:cursor-not-allowed"/>
                </Button>                       
                    </div>

                <Textarea
                placeholder="Type your message here."
                className="min-h-32 text-xl"
                name="output"
                value={output}
                onChange={(e) => 
                setOutput(e.target.value)
                }
                />
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <SubmitButton disabled={!input}/>
                <button type="submit" ref={submitBtnRef}hidden/>
            </div>

        </form>
    </div>
  )
}

export default TranslationForm