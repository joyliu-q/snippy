interface OpenAIResponse {
	choices: {
	  message: {
		content: string;
	  };
	}[];
  }

export async function generate(fileContent: String, prompt: String) {
	const response = await fetch("https://proxy.tune.app/chat/completions", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		  "Authorization": "sk-tune-Sjre53YgSZ3Oufkv5skl1Z2kyN6NjSLfkhG"
		},
		body: JSON.stringify({
		  temperature: 0.3, 
		  messages:  [
			{
				"role": "system",
				"content": prompt
			},
			{
			  "role": "user",
			  "content": `Analyze the following code: ${fileContent}`
			}
		  ],
		  model: "benxu/benxu-gpt-4o-mini",
		  stream: false,
		  "frequency_penalty":  0.2,
		})
	  });
	  
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	
	const data = await response.json() as OpenAIResponse;

	// Assuming the desired content is under a key like 'choices' or similar
	return data.choices[0].message.content;

}