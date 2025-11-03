import { AdventureStory } from '../types';

/**
 * The main adventure story: "The Mysterious Forest"
 * A fantasy adventure where the player explores an enchanted forest
 */
export const mysteriousForestAdventure: AdventureStory = {
  title: 'The Mysterious Forest',
  description: 'You are a brave adventurer who has stumbled upon a mysterious forest. Legend says those who enter either find great treasure or are never seen again.',
  startNodeId: 'start',
  
  initialState: {
    inventory: [],
    stats: {
      health: 100,
      courage: 50,
      wisdom: 25,
    },
    playerName: '',
  },

  nodes: {
    start: {
      id: 'start',
      text: `You stand at the edge of a dark, mysterious forest. Ancient trees tower above you, their branches creating a canopy so thick that barely any sunlight reaches the forest floor. A weathered sign reads: "Enter at your own risk - The Whispering Woods."

You can hear strange sounds coming from within: distant howls, rustling leaves, and what sounds like... whispering? 

Your heart pounds with a mixture of fear and excitement. This could be the adventure you've been seeking, but it could also be your last.`,
      
      choices: [
        {
          text: 'Enter the forest boldly, sword drawn',
          nextNodeId: 'forest_bold',
          consequence: {
            modifyStats: { courage: 10 }
          }
        },
        {
          text: 'Enter cautiously, staying alert',
          nextNodeId: 'forest_cautious',
          consequence: {
            modifyStats: { wisdom: 10 }
          }
        },
        {
          text: 'Look for another way around the forest',
          nextNodeId: 'forest_avoid'
        },
        {
          text: 'Call out to see if anyone responds',
          nextNodeId: 'forest_call'
        }
      ]
    },

    forest_bold: {
      id: 'forest_bold',
      text: `You stride confidently into the forest, your sword gleaming in the dim light. Your bold approach seems to part the very shadows before you. After walking for several minutes, you come to a clearing where you see three paths diverging.

To your left, a narrow path winds uphill toward what looks like an old stone tower.
Straight ahead, a well-worn path continues deeper into the forest.
To your right, you hear the sound of running water.

Your bold entrance has attracted attention - you can sense eyes watching you from the shadows, but they seem more curious than hostile.`,
      
      choices: [
        {
          text: 'Take the left path to the stone tower',
          nextNodeId: 'tower_approach'
        },
        {
          text: 'Continue straight into the deep forest',
          nextNodeId: 'deep_forest'
        },
        {
          text: 'Follow the sound of water to the right',
          nextNodeId: 'river_discovery'
        },
        {
          text: 'Try to communicate with the watchers in the shadows',
          nextNodeId: 'shadow_contact'
        }
      ]
    },

    forest_cautious: {
      id: 'forest_cautious',
      text: `You carefully step into the forest, moving quietly and staying alert to every sound and movement. Your caution pays off - you notice several tripwires that could have triggered traps, and you spot glowing mushrooms that seem to pulse with an otherworldly light.

As you move deeper, your careful observation reveals ancient carvings on some of the trees. They seem to be warnings or guidance left by previous travelers. One carving shows symbols pointing in different directions.

You come to realize you're at a crossroads, though the paths are not immediately obvious to the untrained eye.`,
      
      choices: [
        {
          text: 'Follow the tree carvings that point upward',
          nextNodeId: 'tower_approach'
        },
        {
          text: 'Investigate the glowing mushrooms',
          nextNodeId: 'mushroom_discovery',
          consequence: {
            addToInventory: ['Glowing Mushroom'],
            modifyStats: { wisdom: 5 }
          }
        },
        {
          text: 'Follow the tree carvings that point to water',
          nextNodeId: 'river_discovery'
        },
        {
          text: 'Study the carvings more carefully',
          nextNodeId: 'carving_study'
        }
      ]
    },

    forest_avoid: {
      id: 'forest_avoid',
      text: `You decide to walk around the forest's edge, looking for a safer passage. After an hour of walking, you discover that the forest is much larger than you initially thought. However, you do find something interesting - an old hermit's hut on the outskirts.

Smoke rises from the chimney, and you can smell something delicious cooking inside. Through the window, you see an elderly person reading by the fire. They might have valuable information about the forest, but they might also be dangerous.`,
      
      choices: [
        {
          text: 'Knock on the door politely',
          nextNodeId: 'hermit_polite'
        },
        {
          text: 'Peer through the window first',
          nextNodeId: 'hermit_spy'
        },
        {
          text: 'Continue around the forest',
          nextNodeId: 'forest_circle'
        },
        {
          text: 'Enter the forest from this side',
          nextNodeId: 'forest_side_entrance'
        }
      ]
    },

    forest_call: {
      id: 'forest_call',
      text: `"Hello! Is anyone there?" you call out into the forest. Your voice echoes strangely among the trees, and for a moment, everything falls silent.

Then, unexpectedly, you hear a response - but not from where you expected. A melodious voice calls back from above: "Greetings, earth-bound traveler!"

Looking up, you see a figure perched on a high branch. They appear to be an elf, with pointed ears and clothing that seems to be made from leaves and bark. They gracefully leap down to stand before you.

"I am Silvaleaf, guardian of this forest entrance. It has been many moons since someone announced themselves so politely. Most who come here either sneak about or charge in recklessly."`,
      
      choices: [
        {
          text: 'Ask Silvaleaf about the forest and its dangers',
          nextNodeId: 'elf_guidance'
        },
        {
          text: 'Request safe passage through the forest',
          nextNodeId: 'elf_passage'
        },
        {
          text: 'Ask if there are treasures in the forest',
          nextNodeId: 'elf_treasure'
        },
        {
          text: 'Challenge Silvaleaf to prove they are trustworthy',
          nextNodeId: 'elf_challenge'
        }
      ]
    },

    tower_approach: {
      id: 'tower_approach',
      text: `The stone tower looms before you, ancient and weathered by countless years. Ivy and moss cover its walls, but you can still make out intricate carvings depicting scenes of magic and adventure. The tower appears to be about five stories tall, with a wooden door at its base.

As you approach, you notice the door is slightly ajar, and a warm, golden light emanates from within. You also notice fresh footprints in the dirt - someone else has been here recently.

From inside, you hear the faint sound of pages turning and the scratch of a quill on parchment.`,
      
      choices: [
        {
          text: 'Enter the tower cautiously',
          nextNodeId: 'tower_enter'
        },
        {
          text: 'Call out before entering',
          nextNodeId: 'tower_announce'
        },
        {
          text: 'Examine the footprints more closely',
          nextNodeId: 'tower_investigate'
        },
        {
          text: 'Circle the tower to look for other entrances',
          nextNodeId: 'tower_circle'
        }
      ]
    },

    river_discovery: {
      id: 'river_discovery',
      text: `Following the sound of water, you emerge at the banks of a crystal-clear river that sparkles like liquid diamonds. The water is so pure you can see colorful fish swimming in its depths. Ancient stones form a natural bridge across the water.

On the opposite bank, you see a beautiful garden with flowers that seem to glow with their own inner light. But as you watch, you notice something else - the reflection in the water doesn't quite match what you see above. In the reflection, the garden appears withered and dark.

A sign by the river reads: "The River of Truth - What you see depends on what you seek."`,
      
      choices: [
        {
          text: 'Cross the stone bridge to the garden',
          nextNodeId: 'garden_cross'
        },
        {
          text: 'Drink from the river',
          nextNodeId: 'river_drink',
          consequence: {
            modifyStats: { health: 20, wisdom: 10 }
          }
        },
        {
          text: 'Touch the water and look at your reflection',
          nextNodeId: 'river_reflection'
        },
        {
          text: 'Follow the river upstream',
          nextNodeId: 'river_upstream'
        }
      ]
    },

    mushroom_discovery: {
      id: 'mushroom_discovery',
      text: `You carefully approach the glowing mushrooms. As you get closer, their pulsing light reveals they're not just decorative - they seem to be communicating! The pattern of their glow matches the rhythm of whispers you've been hearing throughout the forest.

When you gently touch one of the mushrooms, visions flash before your eyes: images of the forest's history, ancient magic, and hidden secrets. You see glimpses of a great treasure hidden deep within the forest, but also warnings of a guardian that protects it.

The mushroom you touched begins to shrink and harden, transforming into a glowing crystal that fits perfectly in your palm.`,
      
      choices: [
        {
          text: 'Try to communicate with more mushrooms',
          nextNodeId: 'mushroom_communication'
        },
        {
          text: 'Follow the vision toward the deep forest',
          nextNodeId: 'deep_forest_guided'
        },
        {
          text: 'Use the crystal to find hidden paths',
          nextNodeId: 'crystal_navigation'
        },
        {
          text: 'Continue exploring but keep the crystal hidden',
          nextNodeId: 'forest_cautious_continue'
        }
      ]
    },

    deep_forest: {
      id: 'deep_forest',
      text: `The deeper you venture into the forest, the more magical it becomes. The trees here are enormous, their trunks wider than houses, and their canopy so thick that it feels like twilight even though it's still day.

You hear a low, rumbling growl from somewhere ahead. Two glowing eyes appear in the darkness between the trees - they're large, intelligent, and definitely not human.

A deep voice speaks: "Who dares enter the heart of my domain? I am Thornfang, guardian of the forest's deepest secrets. State your purpose, or face my wrath!"

The creature steps into view - it's a massive wolf-like being with bark-textured fur and small trees growing from its back.`,
      
      choices: [
        {
          text: 'Explain that you seek adventure and treasure',
          nextNodeId: 'guardian_honest'
        },
        {
          text: 'Challenge Thornfang to combat',
          nextNodeId: 'guardian_fight'
        },
        {
          text: 'Offer to help protect the forest',
          nextNodeId: 'guardian_ally'
        },
        {
          text: 'Try to sneak past while Thornfang is talking',
          nextNodeId: 'guardian_sneak'
        }
      ]
    },

    // Ending nodes
    elf_guidance: {
      id: 'elf_guidance',
      text: `Silvaleaf smiles warmly. "Wise to ask before wandering. This forest holds many wonders, but also many perils. The paths change based on the heart of the traveler. Those with pure intentions find aid and treasure. Those with greed or malice find only misfortune."

The elf hands you a silver compass that glows softly. "This will guide you true. Follow its light, and you will find what you truly seek."

Thanks to Silvaleaf's guidance and the magical compass, you navigate the forest safely and discover a hidden grove filled with ancient treasures - not gold or jewels, but knowledge, wisdom, and magical artifacts that will aid you in future adventures.

You emerge from the forest transformed, carrying the true treasure of wisdom and new friendship with the forest's guardians.`,
      
      isEnding: true,
      endingType: 'good',
      choices: []
    },

    guardian_ally: {
      id: 'guardian_ally',
      text: `Thornfang's fierce expression softens with surprise. "In all my centuries as guardian, few have offered friendship instead of demanding passage. Your heart rings true, young one."

The great guardian leads you to a secret grove where the heart of the forest's magic resides - a crystal tree that grants one wish to those who prove themselves worthy through kindness and respect.

You wish not for personal gain, but for the forest and its creatures to remain protected and prosperous. Thornfang is so moved by your selflessness that he names you as an honorary guardian of the forest.

You leave with new magical abilities, a deeper connection to nature, and the knowledge that you've made a difference in the world. The forest will always welcome you as a friend.`,
      
      isEnding: true,
      endingType: 'good',
      choices: []
    },

    guardian_fight: {
      id: 'guardian_fight',
      text: `"So be it!" Thornfang roars, and the battle is fierce. Despite your courage, the guardian is ancient and powerful, with the entire forest lending him strength.

Though you fight valiantly, you are ultimately overwhelmed. As darkness closes in, you hear Thornfang's voice, no longer angry but sad: "Another brave soul lost to pride and aggression. Perhaps in your next life, you will choose wisdom over force."

Your adventure ends here, but perhaps your spirit will join the whispers in the wind, warning future travelers to choose their path more carefully.`,
      
      isEnding: true,
      endingType: 'bad',
      choices: []
    },

    river_drink: {
      id: 'river_drink',
      text: `The water of the River of Truth is the most refreshing thing you've ever tasted. As it flows down your throat, you feel renewed and enlightened. Your mind becomes clearer, and you begin to understand the true nature of the forest.

The garden across the river reveals itself as an illusion - a test to see if you would choose appearance over substance. By drinking from the river instead of being distracted by false beauty, you've passed the test.

The river itself begins to glow, and a pathway of light appears on the water's surface. Following it leads you to a hidden sanctuary where ancient forest spirits dwell. They welcome you as one who seeks truth over illusion and grant you the wisdom of the ages.

You return to the world outside forever changed, carrying knowledge that will help you navigate life's challenges with clarity and purpose.`,
      
      isEnding: true,
      endingType: 'good',
      choices: []
    },

    tower_enter: {
      id: 'tower_enter',
      text: `You push open the door and step inside the tower. The interior is a vast library with books floating gently through the air, candles that burn without wax, and a spiral staircase that seems to twist up into infinity.

At a desk in the center sits an ancient wizard, his beard so long it pools on the floor around his chair. He looks up from his writing and peers at you over his spectacles.

"Ah, a visitor! How delightful. I am Chronos, the Time Keeper. I've been expecting you... or perhaps I've been expecting someone else. Time gets a bit blurry when you've lived as long as I have."

He offers you a choice of three books from his desk: "The Book of Past Adventures," "The Book of Present Possibilities," and "The Book of Future Consequences."

"Choose wisely," he says with a twinkle in his eye. "Each book will determine how your story ends."`,
      
      choices: [
        {
          text: 'Choose "The Book of Past Adventures"',
          nextNodeId: 'ending_past'
        },
        {
          text: 'Choose "The Book of Present Possibilities"',
          nextNodeId: 'ending_present'
        },
        {
          text: 'Choose "The Book of Future Consequences"',
          nextNodeId: 'ending_future'
        }
      ]
    },

    ending_past: {
      id: 'ending_past',
      text: `You choose the Book of Past Adventures, and as you open it, you're drawn into the pages themselves. You experience the adventures of all who came before you - brave knights, wise scholars, cunning rogues, and kind-hearted souls.

Through their experiences, you gain all their knowledge, skills, and wisdom. When you emerge from the book, you are no longer the same person who entered the forest. You have become a living legend, carrying the strength and wisdom of countless heroes.

Chronos nods approvingly. "You chose to learn from the past. Now go forth and create new adventures worthy of inspiring future heroes."

You leave the tower and the forest as a master adventurer, ready to face any challenge the world might present.`,
      
      isEnding: true,
      endingType: 'good',
      choices: []
    },

    ending_present: {
      id: 'ending_present',
      text: `You choose the Book of Present Possibilities, and its pages show you all the different paths your current adventure could take. You see versions where you become a hero, where you fail, where you find love, where you discover magic, and countless other possibilities.

The book teaches you that every moment is filled with infinite potential, and that the power to shape your destiny lies in the choices you make right now. You realize that the real treasure was never gold or jewels, but the ability to recognize and seize the opportunities that surround you.

With this newfound awareness, you step out of the tower and back into the world. Every day becomes an adventure, every choice a chance to create something wonderful.

You have found the greatest treasure of all: the knowledge that you are the author of your own story.`,
      
      isEnding: true,
      endingType: 'good',
      choices: []
    },

    ending_future: {
      id: 'ending_future',
      text: `You choose the Book of Future Consequences, and visions of potential futures flood your mind. You see how each choice you make ripples forward through time, affecting not just yourself but everyone you meet.

Some futures are bright and hopeful, others dark and cautionary. You see that the smallest acts of kindness can change the world, while selfish choices can lead to regret and sorrow. The book shows you that true wisdom lies not in knowing what will happen, but in understanding the weight of your choices.

Armed with this profound understanding, you pledge to use your knowledge responsibly. You become a guide for other adventurers, helping them see the consequences of their actions and choose paths that lead to growth and happiness.

Your adventure in the forest was just the beginning. Your real journey is helping others write better stories for themselves and the world.`,
      
      isEnding: true,
      endingType: 'good',
      choices: []
    }
  }
};