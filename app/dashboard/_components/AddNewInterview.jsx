"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { chatSession } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const AddNewInterview = () => {
    const [openDailog, setOpenDailog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [JsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();

    const { user } = useUser();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        console.log("User Object:", user);
        console.log("User Email:", user?.primaryEmailAddress?.emailAddress);
    
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            console.error("User email is missing! Cannot proceed.");
            setLoading(false);
            return;
        }
    
        const InputPrompt = `jobposition: ${jobPosition}, jobDesc: ${jobDesc}, job of experience: ${jobExperience}, 
            Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format.`
    
        try {
            const result = await chatSession.sendMessage(InputPrompt);
            let MockjsonRes = result.response.text();
    
            // Clean AI response by removing unnecessary characters
            MockjsonRes = MockjsonRes.replace(/^```json/, "").replace(/```$/, "").trim();
    
            let parsedJson;
            try {
                parsedJson = JSON.parse(MockjsonRes);
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                setLoading(false);
                return;
            }
    
            console.log("AI Response:", parsedJson);
            setJsonResponse(parsedJson); // Store parsed JSON instead of raw text
    
            if (parsedJson) {
                const resp = await db.insert(MockInterview).values({
                    mockId: uuidv4(),
                    jsonMockResp: JSON.stringify(parsedJson), // Ensure valid JSON storage
                    jobPosition,
                    jobDesc,
                    jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress || "unknown", 
                    createdAt: moment().toDate()
                }).returning({ mockId: MockInterview.mockId });
    
                console.log("Inserted ID:", resp);
                if (resp.length > 0) {
                    setOpenDailog(false);
                    router.push(`/dashboard/interview/${resp[0]?.mockId}`);
                }
            } else {
                console.log("ERROR: AI response is empty.");
            }
        } catch (error) {
            console.error("Error processing request:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => { setOpenDailog(true) }}
            >
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDailog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job interviewing</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about your job position/role, Job description, and years of experience</h2>

                                    <div className='mt-7 my-3'>
                                        <label>Job Role/Job Position</label>
                                        <Input placeholder='Ex. Full Stack Developer'
                                            required onChange={(event) => { setJobPosition(event.target.value) }} />
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description/ Tech Stack (In Short)</label>
                                        <Textarea placeholder='Ex. React, Angular, NodeJs, MySQL, etc..' required
                                            onChange={(event) => { setJobDesc(event.target.value) }} />
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input placeholder='Ex. 5' type="number" max="50" required
                                            onChange={(event) => { setJobExperience(event.target.value) }} />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant='ghost' onClick={() => { setOpenDailog(false) }}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <> <LoaderCircle /> 'Generating'</> : 'Start Interview'}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview;
