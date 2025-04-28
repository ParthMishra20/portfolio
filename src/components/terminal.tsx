"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CommandResponse {
  text: string | React.ReactNode;
  isError?: boolean;
}

const InteractiveTerminal = () => {
  // We use theme inside the component, but through className conditionals, not directly
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInitialMessage, setShowInitialMessage] = useState<boolean>(false);
  const [history, setHistory] = useState<{ command: string; response: CommandResponse }[]>([
    { command: '', response: { text: "Loading site..." } },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Update the current date/time only on the client
  useEffect(() => {
    setCurrentDateTime(new Date().toLocaleString());
  }, []);

  // Simulate site loading
  useEffect(() => {
    // First delay - show loading
    const timer1 = setTimeout(() => {
      setHistory([
        { command: '', response: { text: "Site loaded successfully!" } },
      ]);
      
      // Second delay - show welcome message
      const timer2 = setTimeout(() => {
        setIsLoading(false);
        setShowInitialMessage(true); // This triggers showing the initial welcome message
        
        // Only add this welcome message if showInitialMessage is true
        if (showInitialMessage) {
          setHistory(prev => [
            ...prev,
            { 
              command: '', 
              response: { 
                text: "Welcome to the interactive terminal! Type 'help' for available commands. Type 'secret' for something fun." 
              } 
            }
          ]);
        }
      }, 800);
      
      return () => clearTimeout(timer2);
    }, 1500);

    return () => clearTimeout(timer1);
  }, [showInitialMessage]);

  // Available commands
  const commands: Record<string, () => CommandResponse> = {
    help: () => ({
      text: (
        <div className="space-y-1 text-gray-200">
          <p>Available commands:</p>
          <p>- <span className="text-green-400">help</span>: Show this help message</p>
          <p>- <span className="text-green-400">about_me</span>: Learn more about me</p>
          <p>- <span className="text-green-400">skills</span>: View my technical skills</p>
          <p>- <span className="text-green-400">projects</span>: See my projects</p>
          <p>- <span className="text-green-400">secret</span>: Discover hidden easter eggs</p>
          <p>- <span className="text-green-400">clear</span>: Clear terminal history</p>
          <p>- <span className="text-green-400">echo [text]</span>: Echo back your text</p>
          <p>- <span className="text-green-400">date</span>: Display current date/time</p>
        </div>
      ),
    }),
    about_me: () => ({
      text: (
        <div className="space-y-1">
          <p>Hey, I'm Parth Mishra — a frontend developer and cloud enthusiast who loves turning ideas into real, working projects.</p>
          <p>Currently pursuing my B.Tech in Cloud Computing, I'm all about building clean, creative, and user-first web experiences.</p>
          <p>Whether it's crafting slick UIs, experimenting with blockchain, or spinning up serverless apps on AWS, I'm always</p>
          <p>chasing the next big thing. I believe in working smart (shoutout to ChatGPT 🤖), staying curious, and keeping</p>
          <p>the vibes high while building cool stuff. Let's make tech a little more awesome, one project at a time.</p>
        </div>
      ),
    }),
    skills: () => ({
      text: (
        <div className="space-y-2">
          <p className="font-semibold">Frontend Development:</p>
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            <div>• HTML5</div>
            <div>• CSS3</div>
            <div>• JavaScript (ES6+)</div>
            <div>• React.js</div>
            <div>• Next.js basics</div>
            <div>• Tailwind CSS</div>
            <div>• Node.js</div>
            <div>• PHP</div>
            <div>• Vite</div>
            <div>• Basic TypeScript</div>
          </div>
          
          <p className="font-semibold mt-4">AWS & Cloud:</p>
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            <div>• S3</div>
            <div>• Route 53</div>
            <div>• CloudFront</div>
            <div>• Lambda</div>
            <div>• API Gateway</div>
            <div>• DynamoDB</div>
            <div>• CloudFormation</div>
            <div>• IAM</div>
            <div>• Basic Terraform</div>
          </div>
          
          <p className="font-semibold mt-4">Databases & Tools:</p>
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            <div>• MySQL</div>
            <div>• MongoDB</div>
            <div>• Supabase</div>
            <div>• Git & GitHub</div>
            <div>• Clerk</div>
            <div>• Python</div>
            <div>• C++</div>
            <div>• Smart Contract Basics</div>
          </div>
        </div>
      ),
    }),
    projects: () => ({
      text: (
        <div className="space-y-2">
          <p>Check out my projects on GitHub:</p>
          <p>
            <a 
              href="https://github.com/ParthMishra20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              github.com/ParthMishra20
            </a>
          </p>
          <p className="mt-2 text-sm">I'm constantly working on new projects. Feel free to browse my repositories!</p>
        </div>
      ),
    }),
    secret: () => ({
      text: (
        <div className="animation-rainbow text-center my-2">
          <p>🎮 Easter Eggs Hunt Guide 🎮</p>
          <p className="mt-2">1. Try the Konami code somewhere on this site...</p>
          <p className="text-sm">↑ ↑ ↓ ↓ ← → ← → B A</p>
          <p className="mt-2">2. Click in the top-left corner 5 times</p>
          <p className="mt-2">3. There might be more hidden surprises...</p>
          <p className="text-xs mt-4 opacity-70">Keep exploring!</p>
        </div>
      ),
    }),
    clear: () => {
      setTimeout(() => {
        setHistory([
          { command: '', response: { text: "Terminal cleared. Type 'help' for available commands." } },
        ]);
      }, 0);
      return { text: 'Clearing terminal...' };
    },
    date: () => ({
      // Use the state variable instead of calling Date directly
      text: `Current date: ${currentDateTime}`
    }),
  };

  // Handle commands with parameters (like echo)
  const handleParameterCommands = (fullCommand: string): CommandResponse | null => {
    const parts = fullCommand.split(' ');
    const command = parts[0].toLowerCase();
    
    if (command === 'echo' && parts.length > 1) {
      return { text: parts.slice(1).join(' ') };
    }
    
    return null;
  };

  // Focus the input on component mount and when clicking on terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    const parts = trimmedInput.split(' ');
    const baseCommand = parts[0].toLowerCase();
    
    // First check for parameter commands
    const paramResponse = handleParameterCommands(trimmedInput);
    if (paramResponse) {
      setHistory([...history, { command: input, response: paramResponse }]);
    } 
    // Then check for direct commands
    else {
      const commandHandler = commands[baseCommand];
      
      let response: CommandResponse;
      if (commandHandler) {
        response = commandHandler();
      } else {
        response = { text: `Command not found: ${baseCommand}. Type 'help' for available commands.`, isError: true };
      }

      setHistory([...history, { command: input, response }]);
    }
    
    setInput('');
    setHistoryIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading) return;
    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0 && history[history.length - 1 - newIndex]) {
        setInput(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0 && history[history.length - 1 - newIndex]) {
        setInput(history[history.length - 1 - newIndex].command);
      } else {
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple command completion
      const inputVal = input.toLowerCase();
      
      if (inputVal) {
        const matchingCommand = Object.keys(commands).find(cmd => 
          cmd.startsWith(inputVal) && cmd !== inputVal
        );
        
        if (matchingCommand) {
          setInput(matchingCommand);
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="terminal-container shadow-lg overflow-hidden"
      onClick={() => !isLoading && inputRef.current?.focus()}
    >
      <div className="terminal-header">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-300">user@portfolio ~ </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="bg-gray-950 p-4 h-96 overflow-y-auto text-gray-200"
      >
        {history.map((item, index) => (
          <div key={index}>
            {item.command && (
              <div className="flex">
                <span className="text-green-500">➜ </span>
                <span className="ml-2 text-gray-100">{item.command}</span>
              </div>
            )}
            <div className={`ml-4 mb-3 ${item.response.isError ? 'text-red-500' : ''}`}>
              {isLoading && index === 0 ? (
                <div className="flex items-center">
                  <span>{item.response.text}</span>
                  <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                </div>
              ) : (
                item.response.text
              )}
            </div>
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-green-500">➜ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="ml-2 flex-grow bg-transparent focus:outline-none text-gray-100"
            autoFocus
            aria-label="Terminal input"
            disabled={isLoading}
          />
        </form>
      </div>
      
      <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between border-t border-gray-700">
        <span>Tab to autocomplete • ↑↓ to navigate history</span>
        <span>Type "help" for commands</span>
      </div>
    </motion.div>
  );
};

export default InteractiveTerminal;