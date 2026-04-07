import { TaskCategory, TaskFrequency } from "@prisma/client";

type TaskData = {
  title: string;
  description: string;
  detailedContent: string;
  weekNumber: number;
  dayNumber?: number;
  frequency: TaskFrequency;
  category: TaskCategory;
  sortOrder: number;
};

export const taskSeedData: TaskData[] = [
  // ============================================
  // WEEK 0: PREPARATION
  // ============================================
  {
    title: "Set up brooder container",
    description: "Choose and prepare your brooder container",
    detailedContent: `For 6 or fewer chicks, a large plastic storage tote (at least 18" x 24") works perfectly. For larger flocks, consider a livestock water tank, pet playpen, or DIY plywood box (4'x4' for up to 25 chicks).

Ensure it has:
• No sharp edges
• Stable, flat bottom
• Enough space for feed, water, and heat source
• Sides tall enough to prevent drafts and escapes (12"+)`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 1,
  },
  {
    title: "Install heat source",
    description: "Set up heat plate or lamp",
    detailedContent: `Heat plates are strongly recommended over heat lamps for safety. They eliminate fire risk and allow chicks to self-regulate temperature.

Heat plate sizing:
• 10-15 chicks: 10" x 10" plate
• 15-30 chicks: 16" x 16" plate

Install at highest setting initially. Place thermometer at chick level away from heat source.`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 2,
  },
  {
    title: "Gather essential equipment",
    description: "Collect all necessary supplies",
    detailedContent: `Must-haves:
□ Brooder container
□ Heat plate with adjustable height
□ Thermometer
□ Chick waterer (1 quart per 6 chicks)
□ Chick feeder (12" per 10-15 chicks)
□ Chick starter feed
□ Paper towels (first 4 days bedding)
□ Pine shavings (after day 4) - NOT cedar!
□ Chick grit
□ Digital scale
□ Electrolytes/vitamins
□ Small first aid kit`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 3,
  },
  {
    title: "Choose brooder location",
    description: "Find the ideal spot for your brooder",
    detailedContent: `Location requirements:
• Draft-free area
• Away from pets and young children
• Easy access to electricity
• Easy to clean (not carpet!)
• Consider noise level

IMPORTANT: Keep far from kitchen! Teflon/non-stick pan fumes are toxic to chicks.`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 4,
  },
  {
    title: "Prepare bedding",
    description: "Layer paper towels in brooder",
    detailedContent: `Cover bottom with paper towels (not newspaper - too slippery!). Paper towels allow you to monitor droppings and prevent chicks from eating bedding as they learn to identify proper food.

Have pine shavings ready for day 5.`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 5,
  },
  {
    title: "Pre-warm brooder",
    description: "Run heat source for 24 hours before chicks arrive",
    detailedContent: `Temperature testing:
• Aim for 95°F at chick level under heat plate
• Ensure temperature gradient exists
• Test at multiple points in brooder
• Make adjustments as needed

Pre-warming ensures stable, consistent heat when chicks arrive.`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 6,
  },
  {
    title: "Final preparations",
    description: "Complete day-before arrival tasks",
    detailedContent: `Day before arrival:
• Fill waterers with room-temp water + starter electrolytes
• Fill feeders with starter crumble
• Double-check heat source is working
• Prepare warm sugar water (1 tsp sugar to 1 cup water) for arrival day dipping
• Have paper towels ready for cleanup
• Pre-mix grit to sprinkle on feed on day 2`,
    weekNumber: 0,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 7,
  },

  // ============================================
  // WEEK 1: WELCOME TO CHICKEN PARENTHOOD
  // ============================================

  // Daily essentials - repeat every day
  {
    title: "Check brooder temperature",
    description: "Maintain 95°F at chick level",
    detailedContent: `Trust your chicks:
• Huddled under heat = too cold
• Pressed against edges away from heat = too hot
• Comfortably scattered about = just right!

Adjust heat source height as needed.`,
    weekNumber: 1,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 1,
  },
  {
    title: "Fresh water - morning",
    description: "Clean and refill waterers",
    detailedContent: `Clean and refill waterers twice daily. Add a few marbles to the water tray to prevent drowning while chicks are small.

Check that all chicks can access water easily.`,
    weekNumber: 1,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },
  {
    title: "Fresh water - evening",
    description: "Clean and refill waterers",
    detailedContent: `Evening water change. Check for debris and bedding in water. Ensure water level is appropriate for chick size.`,
    weekNumber: 1,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 3,
  },
  {
    title: "Check feed level",
    description: "Keep feeders full of starter crumble",
    detailedContent: `They're growing faster than sweet corn in July! Ensure feeders are always accessible and not blocked by bedding.`,
    weekNumber: 1,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 4,
  },
  {
    title: "Quick health scan",
    description: "Count chicks and check for alertness",
    detailedContent: `Take a minute to:
• Count your chicks
• Make sure everyone's moving about
• Check that all are eating
• Look for bright eyes

Note any concerns in your chicken journal.`,
    weekNumber: 1,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 5,
  },

  // Day 1 specific tasks
  {
    title: "Welcome home - beak dipping",
    description: "Dip each chick's beak in water upon arrival",
    detailedContent: `When they arrive:
• Gently dip each chick's beak in water (not over nostrils!)
• Watch until each chick has found water and feed
• Keep visitors to a minimum today

This helps them find water in their new environment.`,
    weekNumber: 1,
    dayNumber: 1,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 10,
  },
  {
    title: "Check for pasty butt",
    description: "Look for dried droppings stuck to vent",
    detailedContent: `Check each chick's bottom for pasty butt (dried droppings stuck to vent).

If found, clean gently with warm, damp cloth. Pat dry thoroughly. This is common in shipped chicks.`,
    weekNumber: 1,
    dayNumber: 1,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 11,
  },

  // Day 2 specific tasks
  {
    title: "Add grit to feed",
    description: "Sprinkle small amount of chick grit",
    detailedContent: `Sprinkle a tiny bit of chick grit in their feed (not too much!) to help their gizzards develop properly.`,
    weekNumber: 1,
    dayNumber: 2,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 12,
  },
  {
    title: "Day 2 pasty butt check",
    description: "Check each chick's bottom again",
    detailedContent: `Check each chick's bottom for pasty butt again. This is still common in the first few days. Clean gently if needed.`,
    weekNumber: 1,
    dayNumber: 2,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 13,
  },
  {
    title: "Observe eating and drinking",
    description: "Watch each chick eat and drink at least once",
    detailedContent: `Take time to observe each chick eating and drinking at least once. Note any chicks that seem reluctant or have difficulty.

Your chicks are starting to show personalities! Some may be bold explorers while others prefer watching from the sidelines.`,
    weekNumber: 1,
    dayNumber: 2,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 14,
  },

  // Day 3 specific tasks
  {
    title: "First partial bedding change",
    description: "Remove wet or soiled areas",
    detailedContent: `First bedding change - remove wet or soiled areas only. Keep some familiar bedding for comfort.`,
    weekNumber: 1,
    dayNumber: 3,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 15,
  },
  {
    title: "Observe social interactions",
    description: "Watch for pecking order establishment",
    detailedContent: `Chicks are establishing their pecking order. Some gentle pecking is normal socialization, but watch for any chick being excessively picked on.

If bullying occurs, add a second feeder and waterer on the opposite side of the brooder.`,
    weekNumber: 1,
    dayNumber: 3,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 16,
  },

  // Days 4-7 tasks
  {
    title: "Check wing feather development",
    description: "Look for early wing feathers emerging",
    detailedContent: `Your chicks should be starting to sprout wing feathers. This is an exciting milestone! They're growing more coordinated and curious.`,
    weekNumber: 1,
    dayNumber: 4,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 17,
  },
  {
    title: "Supervised playtime",
    description: "10 minutes outside brooder on a towel",
    detailedContent: `Allow 10 minutes of supervised "playtime" outside the brooder on a towel in a protected area. This helps with socialization and handling.

Keep the area warm and draft-free. Return chicks to brooder if they seem cold or stressed.`,
    weekNumber: 1,
    dayNumber: 5,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 18,
  },
  {
    title: "Transition to pine shavings",
    description: "Replace paper towels with pine shavings",
    detailedContent: `By day 5, chicks should be eating properly from feeders and are less likely to confuse bedding with food. Transition to 1-2 inches of pine shavings. NEVER use cedar!`,
    weekNumber: 1,
    dayNumber: 5,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 19,
  },
  {
    title: "Weekend complete brooder clean",
    description: "Full bedding replacement and brooder cleaning",
    detailedContent: `Complete brooder cleaning:
• Transfer chicks to temporary container
• Remove all bedding
• Clean entire brooder
• Add fresh bedding
• Return chicks

Do this at least once per week going forward.`,
    weekNumber: 1,
    dayNumber: 7,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 20,
  },
  {
    title: "Week 1 milestone check",
    description: "Verify chicks are active, eating, and growing",
    detailedContent: `If your chicks are active, eating well, growing visibly, and developing their first proper feathers on their wings, congratulations! You've successfully navigated the most critical week of chick rearing.`,
    weekNumber: 1,
    dayNumber: 7,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 21,
  },

  // ============================================
  // WEEK 2: GROWING LIKE WEEDS
  // ============================================

  // Daily tasks
  {
    title: "Check brooder temperature",
    description: "Maintain 90°F at chick level",
    detailedContent: `Time to lower that heat! Reduce brooder temperature to 90°F this week. If using a heat plate, raise it up one notch.

Remember, your chicks will let you know if they're uncomfortable—huddling means too cold, panting and spreading out means too hot.`,
    weekNumber: 2,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 1,
  },
  {
    title: "Morning care routine",
    description: "Water, feed, health check, temperature",
    detailedContent: `Morning care checklist:
• Clean and refill waterers
• Top off feeders
• Quick health check—look for brightness, activity
• Temperature check
• Observe social interactions for 5 minutes`,
    weekNumber: 2,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },
  {
    title: "Evening care routine",
    description: "Water, feed, spot-clean bedding",
    detailedContent: `Evening care checklist:
• Clean and refill waterers again
• Check feed levels
• Spot-clean any very wet bedding areas
• Count your chicks (they're getting faster and trickier!)`,
    weekNumber: 2,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 3,
  },

  // Twice-weekly tasks (days 10 & 14)
  {
    title: "Brooder refresh",
    description: "Complete bedding change and sanitize",
    detailedContent: `Complete bedding change:
• Replace all bedding with fresh pine shavings
• Clean waterers with warm, soapy water
• Sanitize feeders
• Wipe down brooder walls
• Weigh a few chicks to track growth`,
    weekNumber: 2,
    dayNumber: 10,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 10,
  },
  {
    title: "Brooder refresh",
    description: "Complete bedding change and sanitize",
    detailedContent: `Complete bedding change:
• Replace all bedding with fresh pine shavings
• Clean waterers with warm, soapy water
• Sanitize feeders
• Wipe down brooder walls
• Weigh a few chicks to track growth`,
    weekNumber: 2,
    dayNumber: 14,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 11,
  },
  {
    title: "Exploration time",
    description: "15-20 minutes supervised outside brooder",
    detailedContent: `Allow 15-20 minutes of supervised time outside the brooder:
• Create a small "playpen" with towel base and low walls
• Add a few new objects: small mirror (secured), rock, small branch
• Observe which chicks are boldest and which hang back`,
    weekNumber: 2,
    dayNumber: 8,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 12,
  },
  {
    title: "Exploration time",
    description: "15-20 minutes supervised outside brooder",
    detailedContent: `Allow 15-20 minutes of supervised time outside the brooder:
• Create a small "playpen" with towel base and low walls
• Add a few new objects: small mirror (secured), rock, small branch
• Observe which chicks are boldest and which hang back`,
    weekNumber: 2,
    dayNumber: 11,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 13,
  },
  {
    title: "Exploration time",
    description: "15-20 minutes supervised outside brooder",
    detailedContent: `Allow 15-20 minutes of supervised time outside the brooder:
• Create a small "playpen" with towel base and low walls
• Add a few new objects: small mirror (secured), rock, small branch
• Observe which chicks are boldest and which hang back`,
    weekNumber: 2,
    dayNumber: 14,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 14,
  },
  {
    title: "Week 2 milestone check",
    description: "Verify growth and development progress",
    detailedContent: `By end of Week 2, your chicks should be:
• Noticeably larger with more defined wing feathers
• Active and alert, with clear eyes
• Moving confidently around their brooder
• Using all areas of the brooder, not just huddling under heat
• Beginning to establish a hierarchy`,
    weekNumber: 2,
    dayNumber: 14,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 15,
  },

  // ============================================
  // WEEK 3: AWKWARD TEENAGE PHASE
  // ============================================

  // Daily tasks
  {
    title: "Check brooder temperature",
    description: "Maintain 85°F at chick level",
    detailedContent: `Lower brooder temperature to 85°F. Your chicks are developing more feathers now and need less external heat. If using a heat plate, raise it another notch.`,
    weekNumber: 3,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 1,
  },
  {
    title: "Morning & evening care",
    description: "Water, feed, health check, bedding",
    detailedContent: `Morning & Evening essentials:
• Clean and refill waterers
• Check feed levels
• Quick health assessment
• Remove any wet bedding spots

Every third day: do a "deep clean" of one-third of the brooder (rotating sections).`,
    weekNumber: 3,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },

  // Special activities
  {
    title: "Add starter perch",
    description: "Install low perch for practice",
    detailedContent: `If you haven't added a starter perch yet, now's the time! Keep it low (no more than 4 inches off the ground) and stable. Not all chicks will use it right away, but they should have the option.`,
    weekNumber: 3,
    dayNumber: 15,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 10,
  },
  {
    title: "Raise feeders and waterers",
    description: "Adjust height to chick back level",
    detailedContent: `Raise feeders and waterers so the top is level with the chicks' backs. This helps keep bedding out and reduces waste.`,
    weekNumber: 3,
    dayNumber: 15,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 11,
  },
  {
    title: "First treat introduction",
    description: "Offer small amounts of fresh greens",
    detailedContent: `Offer very small amounts of finely chopped fresh greens:
• Try torn lettuce leaf, tender grass clippings, or chopped kale
• Just a handful for the whole brooder
• Treats should not exceed 10% of diet

Make sure grit is available when offering treats!`,
    weekNumber: 3,
    dayNumber: 17,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 12,
  },
  {
    title: "Extended playtime with dust bath",
    description: "20-30 minutes with dust bathing practice",
    detailedContent: `20-30 minutes of supervised time outside the brooder:
• Add a shallow dish with small amount of bedding for dust bathing practice
• Introduce one new texture each time (towel, patch of grass in tray, etc.)`,
    weekNumber: 3,
    dayNumber: 16,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 13,
  },
  {
    title: "Extended playtime with dust bath",
    description: "20-30 minutes with dust bathing practice",
    detailedContent: `20-30 minutes of supervised time outside the brooder:
• Add a shallow dish with small amount of bedding for dust bathing practice
• Introduce one new texture each time (towel, patch of grass in tray, etc.)`,
    weekNumber: 3,
    dayNumber: 19,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 14,
  },
  {
    title: "Extended playtime with dust bath",
    description: "20-30 minutes with dust bathing practice",
    detailedContent: `20-30 minutes of supervised time outside the brooder:
• Add a shallow dish with small amount of bedding for dust bathing practice
• Introduce one new texture each time (towel, patch of grass in tray, etc.)`,
    weekNumber: 3,
    dayNumber: 21,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 15,
  },
  {
    title: "First training session",
    description: "Begin simple call training",
    detailedContent: `Begin simple call training for future free-ranging:
• Use a consistent sound (shaking treat container, specific whistle, or verbal call)
• Make the sound, then immediately offer a small treat
• Repeat for just 2-3 minutes—keep it short and positive!`,
    weekNumber: 3,
    dayNumber: 20,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 16,
  },
  {
    title: "Week 3 milestone check",
    description: "Verify awkward phase development",
    detailedContent: `By end of Week 3, your chicks should be:
• Sporting a patchy mix of down and real feathers
• Using all available space in the brooder actively
• Attempting to perch (at least some of them)
• Showing more defined social structure
• Demonstrating distinct individual personalities
• Able to regulate body temperature better`,
    weekNumber: 3,
    dayNumber: 21,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 17,
  },

  // ============================================
  // WEEK 4: LITTLE CHICKENS
  // ============================================

  // Daily tasks
  {
    title: "Check brooder temperature",
    description: "Maintain 80°F at chick level",
    detailedContent: `Lower brooder temperature to 80°F. Your chickens have substantial feathering now. Consider removing heat during the day if room temperature is above 70°F.`,
    weekNumber: 4,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 1,
  },
  {
    title: "Morning tasks",
    description: "Water, feed, bedding, observation",
    detailedContent: `Morning tasks:
• Fresh water with any supplements
• Check feed levels
• Remove any wet bedding
• Observe flock for 5 minutes—look for normal activity
• Open any covered areas for daytime light exposure`,
    weekNumber: 4,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },
  {
    title: "Evening tasks",
    description: "Water, feed, health check",
    detailedContent: `Evening tasks:
• Clean and refill waterers
• Top off feeders for overnight access
• Final health check—note any changes from morning
• Ensure heat source is functioning properly
• Close any covers for nighttime security if needed`,
    weekNumber: 4,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 3,
  },

  // Twice-weekly tasks
  {
    title: "Complete bedding refresh",
    description: "Replace 1/3 of bedding, rotating sections",
    detailedContent: `Replace 1/3 of bedding each time, rotating which section you clean (front, middle, back). This system keeps some familiar bedding while maintaining cleanliness.`,
    weekNumber: 4,
    dayNumber: 23,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 10,
  },
  {
    title: "Complete bedding refresh",
    description: "Replace 1/3 of bedding, rotating sections",
    detailedContent: `Replace 1/3 of bedding each time, rotating which section you clean (front, middle, back). This system keeps some familiar bedding while maintaining cleanliness.`,
    weekNumber: 4,
    dayNumber: 26,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 11,
  },
  {
    title: "Outdoor introduction",
    description: "30+ minutes in secure outdoor playpen",
    detailedContent: `On mild days (above 65°F), arrange a secure outdoor playpen:
• Start with 30 minutes, increasing by 10 minutes each session
• Provide shade, protection from wind, and escape from rain
• Always supervise completely
• Ensure area is absolutely predator-proof
• Return to brooder if birds seem stressed or weather changes`,
    weekNumber: 4,
    dayNumber: 24,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 12,
  },
  {
    title: "Outdoor introduction",
    description: "30+ minutes in secure outdoor playpen",
    detailedContent: `On mild days (above 65°F), arrange a secure outdoor playpen:
• Increase from last session (aim for 40 minutes)
• Provide shade, protection from wind, and escape from rain
• Always supervise completely
• Ensure area is absolutely predator-proof
• Return to brooder if birds seem stressed or weather changes`,
    weekNumber: 4,
    dayNumber: 27,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 13,
  },
  {
    title: "Upgrade feeders and waterers",
    description: "Switch to larger equipment if needed",
    detailedContent: `Switch to larger feeders and waterers if you haven't already. Hanging feeders work well at this stage if your brooder height allows. Aim to have the top at back height to minimize waste.

Consider adding apple cider vinegar (1 tbsp per gallon) for digestive health.`,
    weekNumber: 4,
    dayNumber: 22,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 14,
  },
  {
    title: "Add varied perching options",
    description: "Different heights and diameters",
    detailedContent: `Add varied perching options at different heights (none higher than 8-12 inches). Use different diameters of perches to help their feet develop properly.`,
    weekNumber: 4,
    dayNumber: 22,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 15,
  },
  {
    title: "Week 4 milestone check",
    description: "Verify halfway point progress",
    detailedContent: `By end of Week 4, your chickens should be:
• Nearly fully feathered
• Active throughout the day with regular rest periods
• Using perches regularly
• Demonstrating proper dust bathing
• Showing breed-specific behaviors emerging
• Large enough that you're wondering where your tiny chicks went!`,
    weekNumber: 4,
    dayNumber: 28,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 16,
  },

  // ============================================
  // WEEK 5: PREPARING FOR THE BIG WORLD
  // ============================================

  // Daily tasks
  {
    title: "Check brooder temperature",
    description: "Maintain 75°F at chick level",
    detailedContent: `Lower brooder temperature to 75°F. Many chicken keepers remove the heat source during the day at this point if room temperature is stable around 70°F, providing heat only at night.`,
    weekNumber: 5,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 1,
  },
  {
    title: "Morning care",
    description: "Water, feed, health assessment",
    detailedContent: `Morning care:
• Fresh water and feed check
• Brief health assessment of each bird
• Remove any wet or soiled bedding
• Open any ventilation panels for daytime`,
    weekNumber: 5,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },
  {
    title: "Evening routine",
    description: "Water, feed, wind-down",
    detailedContent: `Evening routine:
• Clean waterers thoroughly
• Check feed levels for overnight
• Quiet observation time—look for behavior changes
• Reduce light gradually for evening wind-down
• Ensure heat is available for nighttime if needed`,
    weekNumber: 5,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 3,
  },

  // Three times this week tasks
  {
    title: "Outdoor training session",
    description: "45-60 minutes with call training",
    detailedContent: `Outdoor training (45-60 minutes in secure area):
• Introduce a training call before each outdoor session
• Use the same call each time, followed by treat distribution
• Begin teaching them to return to the brooder using this call
• Add natural elements like small branches, safe plants, patches of dirt`,
    weekNumber: 5,
    dayNumber: 29,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 10,
  },
  {
    title: "Outdoor training session",
    description: "45-60 minutes with call training",
    detailedContent: `Outdoor training (45-60 minutes in secure area):
• Use the same training call, followed by treat distribution
• Practice having them return to the brooder using this call
• Add natural elements like small branches, safe plants, patches of dirt`,
    weekNumber: 5,
    dayNumber: 31,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 11,
  },
  {
    title: "Outdoor training session",
    description: "45-60 minutes with call training",
    detailedContent: `Outdoor training (45-60 minutes in secure area):
• Use the same training call, followed by treat distribution
• Practice having them return to the brooder using this call
• Add natural elements like small branches, safe plants, patches of dirt`,
    weekNumber: 5,
    dayNumber: 33,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 12,
  },
  {
    title: "Coop introduction visit",
    description: "15-30 minutes supervised in coop",
    detailedContent: `If your coop is ready, take birds for a supervised visit:
• Start with 15-30 minutes in the enclosed coop
• Show them water and feed locations
• Let them explore while you observe
• Return to brooder before they become stressed`,
    weekNumber: 5,
    dayNumber: 30,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 13,
  },
  {
    title: "Coop introduction visit",
    description: "15-30 minutes supervised in coop",
    detailedContent: `Continue coop familiarization:
• Let them explore longer if comfortable
• Show them water and feed locations again
• Observe how they interact with the space
• Return to brooder before they become stressed`,
    weekNumber: 5,
    dayNumber: 32,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 14,
  },
  {
    title: "Provide free-choice grit",
    description: "Set up separate grit container",
    detailedContent: `If you're introducing more treats and outdoor time, make sure proper poultry grit is available free-choice in a separate container. This helps them digest the variety of foods they're now eating.`,
    weekNumber: 5,
    dayNumber: 29,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 15,
  },
  {
    title: "Begin reducing night lighting",
    description: "Help chicks learn day/night cycles",
    detailedContent: `If you've been providing night lighting, begin reducing it gradually. Chickens need to learn about day/night cycles before coop transition.`,
    weekNumber: 5,
    dayNumber: 30,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 16,
  },
  {
    title: "Coop preparation checklist",
    description: "Ensure coop is 100% ready",
    detailedContent: `Use this time to ensure your coop is 100% ready:
□ Predator-proof enclosure (hardware cloth, not chicken wire)
□ Appropriate-sized roosting bars (2" diameter)
□ Proper ventilation without drafts
□ Weather protection
□ Feeder and waterer locations prepared
□ Nest boxes blocked off (too young to need them yet)
□ Deep bedding in place (4-6" pine shavings)
□ Dust bathing area established
□ Secure run attached to coop
□ Shade available in outdoor areas`,
    weekNumber: 5,
    dayNumber: 35,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 17,
  },
  {
    title: "Week 5 milestone check",
    description: "Verify pre-coop readiness",
    detailedContent: `By end of Week 5, your chickens should be:
• Looking like miniature adult chickens
• Fully feathered with developing combs
• Comfortable with supervised outdoor time
• Responding to basic training cues
• Self-regulating temperature well
• Dust bathing independently
• Showing interest in foraging behaviors
• Developing breed-specific traits`,
    weekNumber: 5,
    dayNumber: 35,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 18,
  },
  // ============================================
  // WEEK 6: THE BIG MOVE
  // ============================================

  // Daily tasks
  {
    title: "Check brooder/coop temperature",
    description: "Maintain 70°F at chick level",
    detailedContent: `Lower to 70°F. Many chickens at this age no longer need supplemental heat if indoor temperatures are above 65°F. Watch their behavior—if they're comfortable and active, the temperature is fine.`,
    weekNumber: 6,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 1,
  },
  {
    title: "Morning care",
    description: "Water, feed, health check",
    detailedContent: `Morning care:
• Fresh water and feed
• Quick health assessment
• Check coop conditions if transitioned
• Observe flock dynamics for any bullying`,
    weekNumber: 6,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },
  {
    title: "Evening care",
    description: "Water, feed, secure coop",
    detailedContent: `Evening care:
• Refill water and check feed
• Ensure all birds are inside coop before closing up
• Check coop security (latches, doors)
• Observe roosting behavior`,
    weekNumber: 6,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 3,
  },

  // Transition tasks
  {
    title: "Begin coop transition",
    description: "Move chickens to coop for daytime hours",
    detailedContent: `Start the coop transition:
• Move chickens to coop in the morning
• Ensure feed and water are available in the coop
• Supervise for the first few hours
• Return to brooder at night for the first 2-3 days
• Gradually extend coop time until they stay overnight`,
    weekNumber: 6,
    dayNumber: 36,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 10,
  },
  {
    title: "First overnight in coop",
    description: "Let chickens sleep in the coop",
    detailedContent: `After 2-3 days of daytime coop use:
• Place chickens on roosts at dusk (they may not find them on their own yet)
• Close coop securely
• Check on them once after dark—they should be settled on roosts
• Open coop early in the morning

Don't worry if they huddle on the floor the first night. They'll figure out roosting!`,
    weekNumber: 6,
    dayNumber: 38,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 11,
  },
  {
    title: "Supervised run time",
    description: "Allow access to outdoor run",
    detailedContent: `With chickens now in the coop, allow supervised access to the attached run:
• Open the pop door in the morning
• Watch how they navigate the new space
• Ensure they can find their way back inside
• Close the pop door at dusk`,
    weekNumber: 6,
    dayNumber: 39,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 12,
  },
  {
    title: "Transition to grower feed",
    description: "Switch from starter to grower feed",
    detailedContent: `At 6 weeks, transition from chick starter to grower feed:
• Mix 75% starter with 25% grower for 2-3 days
• Then 50/50 for 2-3 days
• Then 25% starter / 75% grower
• Full grower feed by end of week

Grower feed has slightly less protein (16-18%) which is appropriate for this age.`,
    weekNumber: 6,
    dayNumber: 36,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 13,
  },
  {
    title: "Week 6 milestone check",
    description: "Verify coop transition progress",
    detailedContent: `By end of Week 6, your chickens should be:
• Spending most or all time in the coop and run
• Finding food and water in the coop reliably
• Beginning to roost at night (some may still floor-sleep)
• Fully feathered and looking like young adult chickens
• Comfortable with their outdoor environment
• Transitioning to grower feed`,
    weekNumber: 6,
    dayNumber: 42,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 14,
  },

  // ============================================
  // WEEK 7: SETTLING IN
  // ============================================

  // Daily tasks
  {
    title: "Morning coop routine",
    description: "Open coop, fresh water & feed, health check",
    detailedContent: `Morning routine:
• Open pop door to the run
• Fresh water and feed
• Quick headcount and health scan
• Check for any signs of respiratory issues (sneezing, discharge)
• Clean any overnight droppings from roost area`,
    weekNumber: 7,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 1,
  },
  {
    title: "Evening coop routine",
    description: "Secure coop, refill water, headcount",
    detailedContent: `Evening routine:
• Refill water and check feed
• Wait for all chickens to go inside at dusk
• Do a headcount
• Close and secure the pop door
• Check coop perimeter for any predator activity`,
    weekNumber: 7,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },

  // Weekly tasks
  {
    title: "Deep coop clean",
    description: "Full bedding replacement and sanitize",
    detailedContent: `Weekly deep clean:
• Remove all soiled bedding
• Scrub waterers and feeders
• Check for any damage to coop structure
• Replace with fresh pine shavings (4-6 inches)
• Check roost bars are secure
• Inspect for any signs of pests (mites, lice)`,
    weekNumber: 7,
    dayNumber: 46,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 10,
  },
  {
    title: "Expand foraging area",
    description: "Allow supervised free-ranging if possible",
    detailedContent: `If your yard is secure, try supervised free-ranging:
• Start with 30-60 minutes in a fenced area
• Use your training call to bring them back
• Watch for predators (hawks, neighborhood cats/dogs)
• Gradually increase free-range time as they learn boundaries

If free-ranging isn't possible, add enrichment to the run: hanging cabbage, scattered treats, logs to perch on.`,
    weekNumber: 7,
    dayNumber: 44,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 11,
  },
  {
    title: "Health assessment",
    description: "Thorough individual health check",
    detailedContent: `Do a thorough check of each bird:
• Check feet for bumblefoot or injuries
• Look at feathers for mites or bare patches
• Check eyes and nostrils for discharge
• Feel the crop—should be full in evening, empty in morning
• Check vent area is clean
• Weigh each bird if possible to track growth`,
    weekNumber: 7,
    dayNumber: 47,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 12,
  },
  {
    title: "Week 7 milestone check",
    description: "Verify settled coop life",
    detailedContent: `By end of Week 7, your chickens should be:
• Fully settled into coop life with a daily routine
• Roosting at night (most of them)
• Comfortable going in and out of the coop/run
• Responding to your training call
• Showing distinct breed characteristics
• Eating grower feed confidently
• Dust bathing regularly`,
    weekNumber: 7,
    dayNumber: 49,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 13,
  },

  // ============================================
  // WEEK 8: GRADUATION
  // ============================================

  // Daily tasks
  {
    title: "Morning coop routine",
    description: "Standard morning care",
    detailedContent: `Your morning routine is well-established by now:
• Open pop door
• Fresh water and feed
• Quick health scan and headcount
• Enjoy watching your flock start their day!`,
    weekNumber: 8,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 1,
  },
  {
    title: "Evening coop routine",
    description: "Standard evening care",
    detailedContent: `Evening routine:
• Refill water and check feed levels
• Headcount as they go to roost
• Secure coop for the night
• Quick perimeter check`,
    weekNumber: 8,
    frequency: TaskFrequency.DAILY,
    category: TaskCategory.FEEDING_WATER,
    sortOrder: 2,
  },

  // Final week tasks
  {
    title: "Remove supplemental heat",
    description: "Fully wean off heat source if not already done",
    detailedContent: `By week 8, your chickens should not need any supplemental heat unless temperatures drop below 50°F. They are fully feathered and can regulate their own body temperature.

If you're still providing heat, now is the time to remove it completely (unless extreme cold weather).`,
    weekNumber: 8,
    dayNumber: 50,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.BROODER_CARE,
    sortOrder: 10,
  },
  {
    title: "Establish long-term care routine",
    description: "Set up your ongoing chicken care schedule",
    detailedContent: `Now that the intensive brooding phase is over, establish your long-term routine:

Daily:
• Morning: open coop, fresh water & feed, health scan
• Evening: close coop, refill water, headcount

Weekly:
• Deep clean coop, replace bedding
• Thorough health check

Monthly:
• Check coop structure for repairs
• Assess feed consumption and adjust
• Update flock records`,
    weekNumber: 8,
    dayNumber: 52,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.ENVIRONMENT,
    sortOrder: 11,
  },
  {
    title: "Final health assessment",
    description: "Complete health check before graduation",
    detailedContent: `Final brooding-phase health check:
• Weigh each bird and record
• Check for any ongoing health concerns
• Verify all birds are fully feathered
• Assess flock dynamics—any persistent bullying?
• Take graduation photos!

Note any birds that may need extra attention going forward.`,
    weekNumber: 8,
    dayNumber: 54,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.HEALTH_CHECK,
    sortOrder: 12,
  },
  {
    title: "Disassemble brooder",
    description: "Clean and store brooder equipment",
    detailedContent: `Time to pack up the brooder:
• Thoroughly clean and disinfect the brooder
• Clean and store heat source
• Wash and store chick-sized feeders/waterers
• Save any supplies you might need for future flocks
• Pat yourself on the back—you did it!`,
    weekNumber: 8,
    dayNumber: 55,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.PREPARATION,
    sortOrder: 13,
  },
  {
    title: "Graduation! Week 8 milestone",
    description: "Celebrate completing the brooding phase",
    detailedContent: `Congratulations! You've successfully raised your chicks through the critical first 8 weeks!

Your flock has graduated from:
• Tiny fluffballs needing 95°F heat → fully feathered birds
• Paper towel bedding → a proper coop with roosts
• Constant monitoring → a comfortable daily routine

What's ahead:
• Continue grower feed until 16-18 weeks
• Watch for first eggs around 18-24 weeks (depending on breed)
• Keep learning and enjoying your backyard flock!

You're officially a chicken keeper. Welcome to the club!`,
    weekNumber: 8,
    dayNumber: 56,
    frequency: TaskFrequency.ONCE,
    category: TaskCategory.MILESTONE,
    sortOrder: 14,
  },
];
