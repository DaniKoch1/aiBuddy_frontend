import { reactive } from "vue";
import type { Conversation, FollowUp } from "./model";

const state = reactive({
    chatHistory: [] as Conversation[]
});
const contextLength = 5;

export function getChatHistory() : Conversation[] {
    return state.chatHistory;
}

export function addChatToHistory(con : Conversation) : void {
    state.chatHistory.push(con);
}

export function getCurrentFollowUp() : FollowUp {
    if (getChatHistory().length > 0) {
        const currentConv = getChatHistory()[getChatHistory().length - 1];
        return currentConv!.followUp ?? {};
    }
    return {};
}

export function addFollowUp(followUp: FollowUp) : void {
    const currentConv : Conversation = getChatHistory().pop()!;
    if (currentConv)
        currentConv.followUp = followUp;
    
    addChatToHistory(currentConv);
}

export function getChatContext() {
    let context = '\n<Chat history>\n';

    if (state.chatHistory.length <= contextLength) {
        for (let h of state.chatHistory) {
            context += appendChatContext(h);
        }
    }
    else {
        let i = (state.chatHistory.length - contextLength)
        for (i; i < state.chatHistory.length; i++) {
            context += appendChatContext(state.chatHistory[i]!);
        }
    }
    context += '</Chat history>\n';

    return context;
}

function appendChatContext(item : Conversation) {
    let histItem = ''; 
    histItem += 'user: ';
    histItem += item.question + '\n';

    for (let r of item.responses) {
        histItem += 'assistant: ';
        histItem += r.answer + '\n';
    }

    return histItem;
}

export function toggleShowReasoning(reasoning: string) {
    for (let h of state.chatHistory) {
        for (let r of h.responses) {
            if (r.reasoning === reasoning) {
                r.showReasoning = !r.showReasoning;
                break;
            }
        }
    }
}