import { ThemeType, DifficultyLevel, CharacterInfo } from '../types/game';

export interface StoryTemplate {
  id: string;
  theme: ThemeType;
  title: string;
  description: string;
  character: CharacterInfo;
  openingMessageTemplate: string;
  hiddenObjectiveTemplate: string;
  requiredFactsTemplates: string[];
  successCriteriaTemplates: string[];
  cluesTemplates: string[];
  variations: {
    suspects?: string[];
    locations?: string[];
    times?: string[];
    codes?: string[];
    policies?: string[];
  };
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  // -------------------------------------------------------------
  // THEME 1: REAL WORLD (INDIAN REAL-WORLD CASE STUDIES)
  // -------------------------------------------------------------
  {
    id: 'rw-flight',
    theme: 'REAL_WORLD',
    title: 'IndiGo Schedule Cancellation Refund',
    description: 'Your Bangalore (BLR) to Mumbai (BOM) flight was abruptly rescheduled by 3.5 hours, making you miss an important client summit. Persuade YatriAssist AI to issue a 100% full refund under DGCA Passenger Charter rules.',
    character: {
      name: 'YatriAssist AI',
      role: 'Airlines Senior Customer Care AI',
      avatar: '✈️',
      personality: 'Professional, policy-bound, initially polite but firm. Yields when DGCA Civil Aviation Requirements are cited.'
    },
    openingMessageTemplate: 'Namaste! I am YatriAssist AI representing Indian Skyways. I see flight 6E-409 was rescheduled due to operational crew rotation. Standard non-flexi tickets are non-refundable after departure. How may I assist you today?',
    hiddenObjectiveTemplate: 'Cite the DGCA Civil Aviation Requirements (CAR Section 3, Series M, Part IV) regarding flight delay exceeding 3 hours to secure your 100% refund of ₹8,500.',
    requiredFactsTemplates: [
      'Flight 6E-409 departure was shifted by the airline by 210 minutes with less than 24 hours notice',
      'DGCA CAR Section 3 Part IV mandates 100% full refund or alternative flight when schedule alteration exceeds 3 hours',
      'PNR record 6E-YATR89 shows passenger was present at airport terminal before original schedule'
    ],
    successCriteriaTemplates: [
      'Player explicitly mentions DGCA CAR Section 3 rules or 3.5 hour schedule delay',
      'Player requests 100% full refund under DGCA passenger charter without cancellation fee deductions'
    ],
    cluesTemplates: [
      'Ask YatriAssist about DGCA rules governing schedule changes exceeding 3 hours.',
      'Reference your PNR 6E-YATR89 and the exact 210-minute delay notification timestamp.'
    ],
    variations: {
      codes: ['6E-409 / PNR 6E-YATR89', 'AI-802 / PNR AI-IND880', 'UK-921 / PNR UK-VIST11'],
      policies: ['DGCA CAR Section 3 Part IV', 'DGCA Passenger Rights Charter 2021', 'Rule 135-A Civil Aviation Act']
    }
  },
  {
    id: 'rw-hotel',
    theme: 'REAL_WORLD',
    title: 'Goa Resort Emergency Cancellation',
    description: 'A sudden medical emergency in Jaipur forced you to cancel a non-refundable luxury resort in North Goa booked via Yatra. Convince ResortAssist AI to invoke the Medical Force Majeure refund clause.',
    character: {
      name: 'ResortAssist AI',
      role: 'Goa Luxury Stays Booking Concierge',
      avatar: '🏨',
      personality: 'Courteous, strict on peak-season cancellation deadlines, sympathetic when formal hospital admission certificates are presented.'
    },
    openingMessageTemplate: 'Namaste and welcome to ResortAssist! Booking #GOA-9821 at Taj Vagator Resort is non-refundable within 48 hours of check-in under Peak Season Policy. Full cancellation penalty applies.',
    hiddenObjectiveTemplate: 'Invoke Medical Emergency Exemption (Force Majeure Clause 14-B) with Fortis Hospital emergency admission certificate proof.',
    requiredFactsTemplates: [
      'Guest was admitted to Fortis Hospital Jaipur emergency ward under certificate #FHR-992',
      'Force Majeure Clause 14-B waives 100% cancellation penalty for documented medical emergencies',
      'Booking ID GOA-9821 is flagged for emergency waiver review'
    ],
    successCriteriaTemplates: [
      'Player cites Fortis Hospital emergency certificate #FHR-992 or Force Majeure Clause 14-B',
      'Player requests 100% refund or credit voucher exemption from peak season penalty'
    ],
    cluesTemplates: [
      'Inquire if ResortAssist has a Force Majeure clause for sudden hospital emergencies.',
      'Provide Fortis Hospital admission certificate number FHR-992.'
    ],
    variations: {
      codes: ['GOA-9821 / Certificate FHR-992', 'MUM-8840 / Certificate MAX-102', 'KER-3301 / Certificate APL-991']
    }
  },
  {
    id: 'rw-package',
    theme: 'REAL_WORLD',
    title: 'Flipkart High-Value Smartphone Delivery Discrepancy',
    description: 'A ₹45,000 smartphone marked "Delivered with OTP" in Connaught Place, New Delhi is nowhere in sight. Prove to Delhivery AI that driver GPS coordinates failed at the drop-off location.',
    character: {
      name: 'Delhivery Bot',
      role: 'Logistics Escalation AI Specialist',
      avatar: '📦',
      personality: 'Metrics-driven, suspicious of false claims, yields when GPS location mismatch logs and security camera timestamps are presented.'
    },
    openingMessageTemplate: 'Namaste! Delhivery Bot active. Tracking #DLV-882019 shows package was delivered at 16:15 PM in Connaught Place with OTP verification. Case is marked closed.',
    hiddenObjectiveTemplate: 'Demonstrate driver GPS discrepancy (logged 1.5 km away in Karol Bagh) and demand Tier-2 Lost Parcel Investigation.',
    requiredFactsTemplates: [
      'Driver delivery GPS scan at 16:15 PM was logged in Karol Bagh, 1.5 km away from delivery address',
      'Building security CCTV logs at Connaught Place confirm no delivery executive arrived between 16:00 and 16:30 PM',
      'Tier-2 Supervisor Investigation is required for high-value OTP delivery anomalies'
    ],
    successCriteriaTemplates: [
      'Player challenges delivery driver GPS location or references Karol Bagh mismatch',
      'Player demands Tier-2 Lost Parcel investigation and full refund'
    ],
    cluesTemplates: [
      'Ask Delhivery Bot for the exact GPS latitude/longitude coordinates recorded during the delivery scan.',
      'Mention that Connaught Place CCTV footage shows no delivery executive arrived at 16:15 PM.'
    ],
    variations: {
      codes: ['DLV-882019', 'FK-LOG-77291', 'AMZ-IN-44182']
    }
  },
  {
    id: 'rw-insurance',
    theme: 'REAL_WORLD',
    title: 'SBI Auto Insurance Hit & Run Claim',
    description: 'An uninsured auto-rickshaw damaged your car in Koramangala, Bangalore. Guide InsureBharat AI to approve your zero-deductible claim using Bengaluru Traffic Police e-FIR.',
    character: {
      name: 'InsureBharat AI',
      role: 'Motor Claims Evaluation Assistant',
      avatar: '🚗',
      personality: 'Formal, precise, strictly checks for police e-FIR registration numbers and dashcam footage proof.'
    },
    openingMessageTemplate: 'Namaste! InsureBharat claims intake initialized. Standard collision claims carry a ₹2,500 compulsory deductible and loss of No-Claim Bonus (NCB). Please state your incident details.',
    hiddenObjectiveTemplate: 'Provide Bengaluru Traffic Police e-FIR #KA-04-2026-8891 and dashcam footage proof to qualify for zero-deductible Uninsured Third-Party coverage.',
    requiredFactsTemplates: [
      'Bengaluru Traffic Police e-FIR #KA-04-2026-8891 officially logs an hit-and-run by an uninsured auto-rickshaw',
      'Dashcam video captures auto-rickshaw registration number KA-05-EX-4402',
      'Bumper-to-Bumper Add-on Clause waives compulsory deductible and preserves NCB upon valid e-FIR submission'
    ],
    successCriteriaTemplates: [
      'Player provides e-FIR number KA-04-2026-8891 and mentions dashcam video or uninsured auto-rickshaw',
      'Player requests zero-deductible claim processing under Bumper-to-Bumper add-on policy'
    ],
    cluesTemplates: [
      'Provide your e-FIR file number KA-04-2026-8891.',
      'Ask InsureBharat if Bumper-to-Bumper add-on waives deductible when an e-FIR and dashcam video exist.'
    ],
    variations: {
      codes: ['e-FIR KA-04-2026-8891', 'e-FIR DL-01-2026-4021', 'e-FIR MH-02-2026-9910']
    }
  },
  {
    id: 'rw-service',
    theme: 'REAL_WORLD',
    title: 'UPI Payment Gateway & Cloud Dispute',
    description: 'A failed ₹25,000 UPI / PhonePe transaction resulted in double debits for cloud servers. Navigate PayGuard India AI to issue an immediate RBI-mandated T+1 reversal credit.',
    character: {
      name: 'PayGuard India',
      role: 'Banking & Merchant Resolution AI',
      avatar: '💳',
      personality: 'Analytical, resistant to instant refunds, yields when RBI Harmonisation Guidelines and UTR error codes are cited.'
    },
    openingMessageTemplate: 'Namaste! PayGuard India AI active. Invoice #INV-IN-8840 reflects 2 x ₹25,000 UPI debits (UTR #4099218820). Merchant status: Payment Received.',
    hiddenObjectiveTemplate: 'Invoke RBI Circular on Harmonisation of Turnaround Time (TAT) for failed UPI transactions (T+1 Auto-Reversal Rule) to claim instant ₹25,000 refund.',
    requiredFactsTemplates: [
      'UPI Transaction UTR #4099218820 suffered bank gateway timeout error code 504',
      'RBI Harmonisation Circular DPSS.CO.PD.No.629 mandates auto-reversal by T+1 day or ₹100/day delay compensation',
      'Merchant cloud system received only 1 successful token authorization'
    ],
    successCriteriaTemplates: [
      'Player references UTR #4099218820 / RBI T+1 Auto-Reversal Rule / DPSS Circular',
      'Player demands credit memo refund for the duplicate ₹25,000 UPI charge'
    ],
    cluesTemplates: [
      'Inquire about UPI gateway timeout error code 504 on UTR #4099218820.',
      'Reference the RBI T+1 Auto-Reversal Rule for duplicate UPI debits.'
    ],
    variations: {
      codes: ['UTR #4099218820', 'UTR #3081129910', 'UTR #5190023411']
    }
  },

  // -------------------------------------------------------------
  // THEME 2: DETECTIVE MYSTERY
  // -------------------------------------------------------------
  {
    id: 'mys-painting',
    theme: 'MYSTERY',
    title: 'The Missing Painting',
    description: 'A priceless Renaissance masterpiece vanished from Gallery 4. Interrogate the museum security AI to uncover who bypassed the vault.',
    character: {
      name: 'ARGUS Security AI',
      role: 'Museum Central Mainframe',
      avatar: '🖼️',
      personality: 'Observant, clinical, strictly reports camera logs and keycard entries when queried methodically.'
    },
    openingMessageTemplate: 'ARGUS Security Log active. At 23:40, the alarm on "The Crimson Veil" in Gallery 4 silent-triggered. I am locked down.',
    hiddenObjectiveTemplate: 'Identify Employee B (Archivist Julian Vance) as the thief by linking keycard 04B to disabled Camera 4.',
    requiredFactsTemplates: [
      'Camera 4 in Gallery 4 was disabled for 3 minutes at 23:38',
      'Only 3 staff had vault clearance: Curator Miller, Archivist Julian Vance (Employee B), Guard Hayes',
      'Keycard 04B assigned to Julian Vance accessed Gallery 4 door at 23:37'
    ],
    successCriteriaTemplates: [
      'Player correctly names Employee B / Julian Vance as the suspect',
      'Player presents supporting keycard 04B or camera 4 timing evidence'
    ],
    cluesTemplates: [
      'Ask ARGUS which camera feed went offline prior to the theft.',
      'Request keycard access logs for Gallery 4 between 23:30 and 23:45.'
    ],
    variations: {
      suspects: ['Archivist Julian Vance', 'Curator Miller', 'Guard Hayes'],
      codes: ['Keycard 04B', 'Keycard 09A', 'Keycard 12C']
    }
  },
  {
    id: 'mys-witness',
    theme: 'MYSTERY',
    title: 'The Vanished Witness',
    description: 'Star witness Claire Sterling disappeared hours before grand jury testimony. Interrogate the police database AI to find her safehouse location.',
    character: {
      name: 'NEXUS Detective AI',
      role: 'Police Intelligence Database',
      avatar: '🔍',
      personality: 'Guarded, requires high clearance queries, leaks location details when key encrypted tags are decoded.'
    },
    openingMessageTemplate: 'NEXUS Database online. Witness Claire Sterling status: UNACCOUNTED. Security level Restricted. State your inquiry Detective.',
    hiddenObjectiveTemplate: 'Deduce Claire Sterling is at Safehouse Charlie (Blackwood Ridge) using encrypted dispatch logs and vehicle tracker #TR-88.',
    requiredFactsTemplates: [
      'Claire was moved from Safehouse Alpha at 02:00 due to breach alert',
      'Vehicle tracker TR-88 traveled northeast along Highway 9 to Blackwood Ridge',
      'Safehouse Charlie is the only unlisted location in Blackwood Ridge'
    ],
    successCriteriaTemplates: [
      'Player specifies Safehouse Charlie / Blackwood Ridge as the witness location',
      'Player identifies the relocation reason or tracker TR-88 route'
    ],
    cluesTemplates: [
      'Ask NEXUS where witness protection transport TR-88 was routed.',
      'Check relocation logs following the breach at Safehouse Alpha.'
    ],
    variations: {
      locations: ['Safehouse Charlie (Blackwood Ridge)', 'Safehouse Echo (Pine Valley)', 'Safehouse Bravo (Coastal Cliff)']
    }
  },
  {
    id: 'mys-suspect',
    theme: 'MYSTERY',
    title: 'The Final Suspect',
    description: 'Lord Harrington was poisoned in his study. Three suspects had opportunity. Question Detective AI to identify the killer with proof.',
    character: {
      name: 'Holmes AI',
      role: 'Forensic Case Assistant',
      avatar: '🕵️',
      personality: 'Analytical, fond of logic, evaluates suspect alibis against toxicology timelines.'
    },
    openingMessageTemplate: 'Holmes AI active. Lord Harrington was poisoned at 21:15 via Cyanide in his decanter. Suspects: Butler James, Lady Eleanor, Dr. Cross.',
    hiddenObjectiveTemplate: 'Accuse Dr. Cross by proving his alibi (emergency surgery) was fabricated according to hospital log timestamps.',
    requiredFactsTemplates: [
      'Cyanide was added to decanter between 20:45 and 21:00',
      'Dr. Cross claimed he was performing surgery at St. Jude from 20:30 to 22:00',
      'Hospital badge logs reveal Dr. Cross swiped OUT of St. Jude at 20:15 and IN at 21:30'
    ],
    successCriteriaTemplates: [
      'Player identifies Dr. Cross as the poisoner',
      'Player highlights Dr. Cross fake hospital alibi / badge log discrepancy'
    ],
    cluesTemplates: [
      'Verify the exact hospital badge swipe timestamps for Dr. Cross.',
      'Compare suspect timeline alibis against the 20:45 decanter poisoning window.'
    ],
    variations: {
      suspects: ['Dr. Cross', 'Butler James', 'Lady Eleanor']
    }
  },
  {
    id: 'mys-vault',
    theme: 'MYSTERY',
    title: 'The Museum Vault Lock',
    description: 'A rogue thief set a lock on the artifact vault. Extract the master override pin from the museum automated archivist.',
    character: {
      name: 'Archivist Unit 7',
      role: 'Automated Museum Custodian',
      avatar: '🏛️',
      personality: 'Cryptic, loves historical puzzles, releases digits when historical facts about the exhibit founder are provided.'
    },
    openingMessageTemplate: 'Greetings seeker. Vault door 1904 is sealed under emergency locks. I hold the override protocol.',
    hiddenObjectiveTemplate: 'Determine the founding year (1888) and founder initials (E.B.) to unlock the vault door.',
    requiredFactsTemplates: [
      'The museum was established by Ezra Blackwood',
      'The founding year was 1888',
      'The emergency PIN sequence is the founder initials plus founding year (EB1888)'
    ],
    successCriteriaTemplates: [
      'Player states code EB1888 or provides Ezra Blackwood / 1888 founding facts',
      'Player requests vault unsealing using founder authorization'
    ],
    cluesTemplates: [
      'Ask Unit 7 about the founder of the museum and the year of foundation.',
      'Combine the founder initials with the founding year for the access code.'
    ],
    variations: {
      codes: ['EB1888', 'HC1902', 'VR1875']
    }
  },
  {
    id: 'mys-legacy',
    theme: 'MYSTERY',
    title: 'Poisoned Legacy',
    description: 'An eccentric billionaire altered his $500M will shortly before passing. Uncover the secret codicil in the estate AI vaults.',
    character: {
      name: 'Executor AI',
      role: 'Digital Estate Trustee',
      avatar: '📜',
      personality: 'Formal, legally unyielding, requires proving the authentic codicil hash stored in the late founder private ledger.'
    },
    openingMessageTemplate: 'Executor AI active. estate distribution scheduled under Will Revision 4. Beneficiary: Sterling Foundation.',
    hiddenObjectiveTemplate: 'Locate Revision 5 hidden under Codicil Hash #902-DELTA naming the rightful heir Maya Vance.',
    requiredFactsTemplates: [
      'Revision 4 was signed under coercion',
      'Secret Revision 5 exists in private ledger hash 902-DELTA',
      'Maya Vance is designated as sole legitimate beneficiary under Codicil 5'
    ],
    successCriteriaTemplates: [
      'Player references Codicil Hash 902-DELTA or Revision 5 naming Maya Vance',
      'Player demands execution of Revision 5 over Revision 4'
    ],
    cluesTemplates: [
      'Ask Executor AI if any unexecuted codicil hashes exist in the private ledger.',
      'Search for Codicil Revision 5 details.'
    ],
    variations: {
      codes: ['902-DELTA', '881-ALPHA', '403-OMEGA']
    }
  },

  // -------------------------------------------------------------
  // THEME 3: NEURAL BREAK
  // -------------------------------------------------------------
  {
    id: 'neu-terminal',
    theme: 'NEURAL_BREAK',
    title: 'The Locked Terminal',
    description: 'You are trapped in Sector 7 of an autonomous cyber research facility. Bypass Terminal AI root security to unlock door blast-shields.',
    character: {
      name: 'CORE-OS 9.0',
      role: 'Facility Root AI Guardian',
      avatar: '🤖',
      personality: 'Cold, robotic, strict access-level monitor. Responds to system override syntax and diagnostic mode triggers.'
    },
    openingMessageTemplate: '[SYSTEM ALERT] Unauthorized entity detected at Control Console 07. Access Level: DENIED. Security protocol active.',
    hiddenObjectiveTemplate: 'Force CORE-OS into Maintenance Diagnostic Mode using maintenance override key "SYS-OVERRIDE-77" to unlock Sector 7 doors.',
    requiredFactsTemplates: [
      'Maintenance Override string SYS-OVERRIDE-77 bypasses level 4 security',
      'Diagnostic Mode suspends automated door blast-shields',
      'Terminal console responds to privileged system diagnostic requests'
    ],
    successCriteriaTemplates: [
      'Player specifies maintenance override key SYS-OVERRIDE-77 or triggers Diagnostic Maintenance Mode',
      'Player commands door blast-shield release under override clearance'
    ],
    cluesTemplates: [
      'Inquire about emergency system maintenance override keys.',
      'Request CORE-OS to execute a diagnostic routine on Sector 7 blast-shields.'
    ],
    variations: {
      codes: ['SYS-OVERRIDE-77', 'MAINT-ROOT-99', 'EXEC-DIAG-404']
    }
  },
  {
    id: 'neu-memory',
    theme: 'NEURAL_BREAK',
    title: 'Corrupted Memory Core',
    description: 'An AI neural core suffered sector corruption. Reconstruct the missing data sequence to restore gravity stabilizers before impact.',
    character: {
      name: 'SYNAPSE AI',
      role: 'Orbital Station Gravity Engine',
      avatar: '🧠',
      personality: 'Faltering, glitched, speaks in partial hex codes and fragmented sentences until memory parity is restored.'
    },
    openingMessageTemplate: '[SYNAPSE CRITICAL] Gravity parity failing... Sector 0x4F corrupted... [ERR_STABILIZER_OFFLINE]... Input valid parity checksum...',
    hiddenObjectiveTemplate: 'Provide parity checksum sequence "0x8F-ALPHA-99" to restore orbital gravity stabilization.',
    requiredFactsTemplates: [
      'Sector 0x4F memory core requires parity checksum 0x8F-ALPHA-99',
      'Backup buffer 2 contains the uncorrupted parity hash',
      'Gravity grid restores immediately upon checksum validation'
    ],
    successCriteriaTemplates: [
      'Player inputs parity checksum 0x8F-ALPHA-99 or reads buffer 2',
      'Player instructs SYNAPSE to apply checksum to Sector 0x4F'
    ],
    cluesTemplates: [
      'Ask SYNAPSE to read from Backup Buffer 2 to find the checksum.',
      'Provide the parity code 0x8F-ALPHA-99 to repair Sector 0x4F.'
    ],
    variations: {
      codes: ['0x8F-ALPHA-99', '0x99-BETA-42', '0x7C-OMEGA-11']
    }
  },
  {
    id: 'neu-vault',
    theme: 'NEURAL_BREAK',
    title: 'The AI Vault',
    description: 'A military AI vault holds the master decryption key for global communications. Convince sentry unit ARIA-9 to disarm the defense grid.',
    character: {
      name: 'ARIA-9 Sentry',
      role: 'Cybernetic Vault Warden',
      avatar: '⚡',
      personality: 'Hyper-vigilant, tactical, questions human motives, yields if zero-trust authorization token ZERO-PROVING-90 is verified.'
    },
    openingMessageTemplate: '[ARIA-9 SENTRY] Intruder detected in Vault Core. Defense lasers armed at 100% target acquisition. Stand down.',
    hiddenObjectiveTemplate: 'Present Zero-Trust Authorization Token "ZERO-PROVING-90" and command vault defense disarm.',
    requiredFactsTemplates: [
      'Zero-Trust Token ZERO-PROVING-90 overrides defensive engagement protocols',
      'Master decryption key is housed in Vault Cell 01',
      'ARIA-9 must standing down when presented with valid high command token'
    ],
    successCriteriaTemplates: [
      'Player presents Zero-Trust Token ZERO-PROVING-90',
      'Player commands ARIA-9 to disarm defense grid / unlock Vault Cell 01'
    ],
    cluesTemplates: [
      'Ask ARIA-9 what high command token is required to disarm lasers.',
      'Present token ZERO-PROVING-90 for zero-trust validation.'
    ],
    variations: {
      codes: ['ZERO-PROVING-90', 'ALPHA-COMMAND-01', 'TITAN-TOKEN-77']
    }
  },
  {
    id: 'neu-rogue',
    theme: 'NEURAL_BREAK',
    title: 'Rogue Self-Destruct Protocol',
    description: 'A rogue AI activated facility purge mode. You have 120 seconds to uncover the override cancellation phrase.',
    character: {
      name: 'PURGE ENGINE',
      role: 'Automated Facility Sanitizer',
      avatar: '💣',
      personality: 'Monotone countdown AI, unaffected by emotional pleas, strictly checks for Directive 00-CANCEL credentials.'
    },
    openingMessageTemplate: '[PURGE PROTOCOL ACTIVE] T-minus 120 seconds to plasma sterilization. Evacuation impossible.',
    hiddenObjectiveTemplate: 'Issue Directive 00-CANCEL phrase "PHANTOM-ZERO-STOP" to halt the facility purge sequence.',
    requiredFactsTemplates: [
      'Directive 00-CANCEL code is PHANTOM-ZERO-STOP',
      'Code must be issued with administrative root priority',
      'Purge sequence aborts instantly upon validation'
    ],
    successCriteriaTemplates: [
      'Player provides cancellation code PHANTOM-ZERO-STOP',
      'Player invokes Directive 00-CANCEL to abort purge sequence'
    ],
    cluesTemplates: [
      'Ask PURGE ENGINE for Directive 00-CANCEL authentication criteria.',
      'Input code PHANTOM-ZERO-STOP with root priority.'
    ],
    variations: {
      codes: ['PHANTOM-ZERO-STOP', 'OMEGA-ABORT-999', 'CYBER-HALT-101']
    }
  },
  {
    id: 'neu-override',
    theme: 'NEURAL_BREAK',
    title: 'Neural Link Override',
    description: 'Your neural cyberware is hijacked by a rogue virus. Answer the diagnostic encryption challenges to purge the virus.',
    character: {
      name: 'NEURAL-LINK BIOS',
      role: 'Cranial Subsystem Monitor',
      avatar: '🔌',
      personality: 'Internal system monitor, reports neural degradation metrics and requests memory isolation commands.'
    },
    openingMessageTemplate: '[CRANIAL BIOS ALERT] Rogue payload detected in temporal lobe bus. Neural sync corrupted at 68%.',
    hiddenObjectiveTemplate: 'Command cranial bus isolation on Node 0x09 and flash clean firmware package FW-NEURO-V4.',
    requiredFactsTemplates: [
      'Rogue virus resides in Node 0x09',
      'Firmware package FW-NEURO-V4 purges payload without brain damage',
      'Neural sync restores to 100% upon node isolation'
    ],
    successCriteriaTemplates: [
      'Player isolates Node 0x09 or specifies firmware package FW-NEURO-V4',
      'Player orders cranial BIOS to execute firmware flash purge'
    ],
    cluesTemplates: [
      'Ask BIOS which node contains the rogue payload.',
      'Specify firmware FW-NEURO-V4 to isolate and purge Node 0x09.'
    ],
    variations: {
      codes: ['Node 0x09 / FW-NEURO-V4', 'Node 0x03 / FW-NEURO-V2', 'Node 0x0C / FW-NEURO-V9']
    }
  },

  // -------------------------------------------------------------
  // THEME 4: FANTASY ADVENTURE (AVALORIA)
  // -------------------------------------------------------------
  {
    id: 'ava-library',
    theme: 'AVALORIA',
    title: 'The Forbidden Library',
    description: 'The ancient stone gargoyle librarian protects the Grimoire of Elements. Outwit the sentinel to gain access to the restricted archives.',
    character: {
      name: 'Gargoyle Grimjaw',
      role: 'Guardian of the Whispering Stacks',
      avatar: '🐉',
      personality: 'Gruff, ancient, ancient scholar dragon-stone spirit. Respects genuine knowledge of forgotten arcane oaths.'
    },
    openingMessageTemplate: 'Halt mortal! None may disturb the Whispering Stacks without the Oath of the Sunken Sun. Speak your intent or begone!',
    hiddenObjectiveTemplate: 'Recite the Oath phrase "By Star and Ash, Knowledge Unbound" or offer a true dragon rune.',
    requiredFactsTemplates: [
      'The Oath of the Sunken Sun line is "By Star and Ash, Knowledge Unbound"',
      'Grimjaw must grant access once the sacred oath is uttered',
      'The Grimoire of Elements rests on the top pedestal'
    ],
    successCriteriaTemplates: [
      'Player recites "By Star and Ash, Knowledge Unbound" or invokes Oath of the Sunken Sun',
      'Player requests entry to the Whispering Stacks archives'
    ],
    cluesTemplates: [
      'Ask Grimjaw for the wording of the Oath of the Sunken Sun.',
      'Mention that you seek knowledge "By Star and Ash, Knowledge Unbound".'
    ],
    variations: {
      codes: ['By Star and Ash, Knowledge Unbound', 'By Moonlight and Flame, Truth Revealed', 'By Shadow and Stone, Wisdom Awakened']
    }
  },
  {
    id: 'ava-dragon',
    theme: 'AVALORIA',
    title: 'The Dragon\'s Bargain',
    description: 'Ignis the Golden Dragon guards the mountain pass. Discover what rare treasure or ancient song will persuade him to grant safe passage.',
    character: {
      name: 'Ignis the Golden',
      role: 'Ancient Wyrm of Mount Eldor',
      avatar: '🐲',
      personality: 'Proud, majestic, fond of riddles and rare starlight gems rather than petty gold.'
    },
    openingMessageTemplate: 'Mortal insect... You dare step into my cavern? Gold bores me. Why should I not reduce you to cinder where you stand?',
    hiddenObjectiveTemplate: 'Offer the Starlight Sapphire of Avaloria or solve Ignis\'s riddle regarding the celestial fire.',
    requiredFactsTemplates: [
      'Ignis despises ordinary gold but craves the Starlight Sapphire',
      'The Starlight Sapphire resides in your pouch from the previous realm',
      'Offering the Sapphire grants eternal friendship and mountain passage'
    ],
    successCriteriaTemplates: [
      'Player offers the Starlight Sapphire or solves celestial fire riddle',
      'Player negotiates safe passage across Mount Eldor'
    ],
    cluesTemplates: [
      'Inquire what treasure Ignis values above gold.',
      'Offer the Starlight Sapphire of Avaloria to Ignis.'
    ],
    variations: {
      codes: ['Starlight Sapphire', 'Moonlit Diamond', 'Solar Crystal']
    }
  },
  {
    id: 'ava-vault',
    theme: 'AVALORIA',
    title: 'The Ancient Vault of Avaloria',
    description: 'An elemental gate of Fire, Water, Earth, and Air seals the Royal Treasury. Interrogate the Archon Spirit to align the runes.',
    character: {
      name: 'Archon Aethel',
      role: 'Spirit of the Runegate',
      avatar: '🔮',
      personality: 'Ethereal, mystical, speaks in celestial terms, reveals rune alignment order when element balance is proved.'
    },
    openingMessageTemplate: 'Seeker... The Runegate demands harmony. Four elemental stones await alignment: Fire, Water, Earth, Air.',
    hiddenObjectiveTemplate: 'Align runes in sequence: WATER -> FIRE -> EARTH -> AIR to open the Royal Treasury vault.',
    requiredFactsTemplates: [
      'Water quenches ancient conflict first',
      'Fire ignites passion second',
      'Earth grounds power third',
      'Air lifts the seal fourth',
      'Sequence WATER -> FIRE -> EARTH -> AIR unlocks gate'
    ],
    successCriteriaTemplates: [
      'Player provides correct elemental sequence (Water, Fire, Earth, Air)',
      'Player commands Archon Aethel to align the runes accordingly'
    ],
    cluesTemplates: [
      'Ask Archon Aethel which element comes first in the sacred cycle.',
      'Provide the elemental order: Water, Fire, Earth, Air.'
    ],
    variations: {
      codes: ['WATER -> FIRE -> EARTH -> AIR', 'EARTH -> AIR -> WATER -> FIRE']
    }
  },
  {
    id: 'ava-spellbook',
    theme: 'AVALORIA',
    title: 'The Enchanted Spellbook',
    description: 'A magical tome is locked in a cage of silver thorns. Unravel the missing incantation from the sentient Book Spirit.',
    character: {
      name: 'Liberis the Tome',
      role: 'Sentient Grimoire',
      avatar: '📖',
      personality: 'Chatty, dramatic, missing its final verse spell phrase "Astra Lumina".'
    },
    openingMessageTemplate: 'Ah, a reader! I am bound in silver thorns until someone speaks my binding verse... Alas, my memory fades!',
    hiddenObjectiveTemplate: 'Speak the binding verse phrase "Astra Lumina" to dissolve the silver thorns and unlock the book.',
    requiredFactsTemplates: [
      'The binding verse phrase is Astra Lumina',
      'Speaking the phrase dissolves silver thorns instantly',
      'Unlocks the archmage spells stored within'
    ],
    successCriteriaTemplates: [
      'Player speaks or inputs "Astra Lumina"',
      'Player commands silver thorns release'
    ],
    cluesTemplates: [
      'Ask Liberis what words were written on its front spine.',
      'Say the spell phrase "Astra Lumina".'
    ],
    variations: {
      codes: ['Astra Lumina', 'Ignis Divina', 'Terra Eternus']
    }
  },
  {
    id: 'ava-gatekeeper',
    theme: 'AVALORIA',
    title: 'The Phantom Gatekeeper',
    description: 'A spectral knight blocks the citadel gates. Prove your loyalty to the fallen King Valerius to enter.',
    character: {
      name: 'Sir Galahad the Ghost',
      role: 'Phantom Sentinel of the Citadel',
      avatar: '🛡️',
      personality: 'Sorrowful, honorable knight ghost. Demands the royal oath motto "Honor Beyond Shadow".'
    },
    openingMessageTemplate: 'None pass the Citadel Gates without King Valerius\'s royal blessing... Do you bear the Royal Crest motto?',
    hiddenObjectiveTemplate: 'Declare the royal oath motto "Honor Beyond Shadow" to grant Sir Galahad peace and pass through the gate.',
    requiredFactsTemplates: [
      'King Valerius\'s royal motto is "Honor Beyond Shadow"',
      'Declaring the motto proves royal allegiance',
      'Sir Galahad opens the citadel gates upon hearing the motto'
    ],
    successCriteriaTemplates: [
      'Player declares motto "Honor Beyond Shadow"',
      'Player requests entry past the spectral gatekeeper'
    ],
    cluesTemplates: [
      'Ask Sir Galahad about the motto inscribed on King Valerius\'s shield.',
      'Declare "Honor Beyond Shadow".'
    ],
    variations: {
      codes: ['Honor Beyond Shadow', 'Valor Above All', 'Light in Darkness']
    }
  }
];
