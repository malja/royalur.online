// https://grammar.yourdictionary.com/parts-of-speech/adjectives/list-of-adjective-words.html
import db from "../db.js";
import {nowToTimestamp} from "./tools.js";

const username_adjectives = [
    "adorable","adventurous","aggressive","agreeable","alert","alive","amused","angry","annoyed","annoying","anxious",
    "arrogant","ashamed","attractive","average","awful","bad","beautiful","better","bewildered","black","bloody","blue",
    "blue-eyed","blushing","bored","brainy","brave","breakable","bright","busy","calm","careful","cautious","charming",
    "cheerful","clean","clear","clever","cloudy","clumsy","colorful","combative","comfortable","concerned","condemned",
    "confused","cooperative","courageous","crazy","creepy","crowded","cruel","curious","cute","dangerous","dark","dead",
    "defeated","defiant","delightful","depressed","determined","different","difficult","disgusted","distinct",
    "disturbed","dizzy","doubtful","drab","dull","eager","easy","elated","elegant","embarrassed","enchanting",
    "encouraging","energetic","enthusiastic","envious","evil","excited","expensive","exuberant","fair","faithful",
    "famous","fancy","fantastic","fierce","filthy","fine","foolish","fragile","frail","frantic","friendly","frightened",
    "funny","gentle","gifted","glamorous","gleaming","glorious","good","gorgeous","graceful","grieving","grotesque",
    "grumpy","handsome","happy","healthy","helpful","helpless","hilarious","homeless","homely","horrible","hungry",
    "hurt","ill","important","impossible","inexpensive","innocent","inquisitive","itchy","jealous","jittery","jolly",
    "joyous","kind","lazy","light","lively","lonely","long","lovely","lucky","magnificent","misty","modern",
    "motionless","muddy","mushy","mysterious","nasty","naughty","nervous","nice","nutty","obedient","obnoxious",
    "odd","old-fashioned","open","outrageous","outstanding","panicky","perfect","plain","pleasant","poised","poor",
    "powerful","precious","prickly","proud","putrid","puzzled","quaint","real","relieved","repulsive","rich","scary",
    "selfish","shiny","shy","silly","sleepy","smiling","smoggy","sore","sparkling","splendid","spotless","stormy",
    "strange","stupid","successful","super","talented","tame","tasty","tender","tense","terrible","thankful",
    "thoughtful","thoughtless","tired","tough","troubled","ugliest","ugly","uninterested","unsightly","unusual",
    "upset","uptight","vast","victorious","vivacious","wandering","weary","wicked","wide-eyed","wild","witty","worried",
    "worrisome","wrong","zany","zealous",
];

// https://animalcorner.org/animals/
// https://7esl.com/animals-vocabulary-animal-names/
const username_nouns = [
    "aardvark","addax","albatross","alligator","alpaca","anaconda","ant","antelope","ape","armadillo","asp","baboon",
    "badger","barracuda","bat","bear","beaver","bee","beetle","bilby","bird","bison","blobfish","bobcat","boiga",
    "bongo","borkie","bowfin","boxfish","brontosaurus","budgerigar","buffalo","butterfly","camel","capybara","caribou",
    "carp","cat","caterpillar","catfish","chameleon","cheetah","chicken","chihuahua","chimaera","chimpanzee","cicada",
    "clownfish","cockroach","codfish","cormorant","cow","coyote","crab","cricket","crocodile","crow","cuckoo","deer",
    "dingo","dog","dolphin","donkey","dove","dragonfly","duck","dugong","dunker","eagle","earthworm","eel","elephant",
    "elk","emu","falcon","ferret","firefly","fish","flamingo","flea","fly","fox","frog","gazelle","gecko","gibbon",
    "giraffe","goat","goldfish","goose","gorilla","haddock","halibut","hamster","hawk","hare","hedgehog","herring",
    "hippopotamus","hornbill","horse","horsefly","husky","hyena","ibis","impala","jackal","jaguar","jellyfish",
    "kakapo","kangaroo","kiwi","koala","krill","kudu","ladybug","lemur","leopard","liger","lion","lizard","llama",
    "lobster","lynx","magpie","mamba","mayfly","megalodon","mole","mongoose","monkey","moose","mosquito","moth",
    "mouse","mule","muskrat","narwhal","ocelot","octopus","okapi","olm","opossum","orangutan","ostrich","otter","owl",
    "ox","oyster","panda","parrot","parrotfish","peacock","pelican","penguin","pigeon","piranha","platypus","pointer",
    "pomeranian","possum","prawn","pteranodon","pterodactyl","pug","puma","python","quail","quoll","rabbit","raccoon",
    "raven","rat","reindeer","robin","rooster","salamander","salmon","scorpion","seagull","seahorse","seal","serval",
    "shark","sheep","shrimp","skunk","sloth","snail","sparrow","spider","sponge","squid","squirrel","starfish","stork",
    "swan","tapir","termite","tiger","toad","tortoise","trout","tuna","turkey","velociraptor","vulture","walrus",
    "warthog","wasp","weasel","wolf","wolffish","wolverine","wombat","woodlouse","woodpecker","woodrat","worm",
    "wrasse","xerus","yak","zebra","zuchon"
];

function capitalize(text) {
    return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export function createUserName() {
    const adjective = username_adjectives[ Math.floor(Math.random() * username_adjectives.length) ];
    const noun = username_nouns[ Math.floor(Math.random() * username_nouns.length) ];

    return capitalize(adjective) + capitalize(noun);
}

export async function getTopUsers(db) {
    return db("users").withSchema("public")
        .select(["name", "elo", "winrate", "number_of_games"])
        .orderBy("elo", "DESC")
        .limit(10);
}

export async function checkToken(token, db) {
    return db("user_tokens").withSchema("public")
        .select("*")
        .where({token: token})
        .andWhere((b) => {
            b.where((builder) => {
                // Token nebyl použit a zároveň je ještě v limitu použití na první přihlášení
                builder.where({used: false}).andWhere("first_login_until", "<=", nowToTimestamp());
            }).orWhere((builder) => {
                // Token byl použit, a jeho použitelnost je stále v limitu pro opakované přihlášení
                builder.where({used: true}).andWhere("active_until", "<=", nowToTimestamp());
            });
        })
        .orderBy("created_at", "DESC")
        .limit(1);
}

export async function getUserFromToken(token, db) {
    return db("user_tokens").withSchema("public")
        .select(["user_tokens.token as token"])
        .where("user_tokens");
}