import {Injectable } from "@nestjs/common";
import {GoogleGenerativeAI} from "@google/generative-ai";
import { any } from "@neo4j/cypher-builder";

@Injectable()
export class AiProvider{
    private genAI: GoogleGenerativeAI;
    private model= any;

    constructor() {
        this.genAI = new GoogleGenerativeAI('');//tengo q configurar api key
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async analyzeActivity(systemContext: string, userContent: any) {
        const prompt = `${systemContext}\n\nStudent Action Data: ${JSON.stringify(userContent)}`;
    
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
  }
}