import { events, all_operators } from "./effect";
import Session from "./session";
events.worldInitialize.subscribe(() => all_operators().map(Session.bind));
