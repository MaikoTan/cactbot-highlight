// Type Definition for cactbot's raidboss module
// See https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md
// and https://github.com/quisquous/cactbot/blob/main/ui/raidboss/common_replacement.js

export interface Locale {
  en?: string;
  de?: string;
  fr?: string;
  ja?: string;
  cn?: string;
  ko?: string;
}

export interface OutputStrings {
  [s: string]: Locale;
}

type TriggerFunction<T> = (data: unknown, matches?: RegExpMatchArray) => T;

type TriggerFunctionWithOutput<T> = (
  data: unknown,
  matches?: RegExpMatchArray,
  output?: { [x: string]: () => Locale },
) => T;

export interface Replacement {
  [s: string]: string;
}

export type CommonReplacementWithEnItem = {
  [s in keyof Locale]: string;
};

export type CommonReplacementItem = {
  [s in Exclude<keyof Locale, "en">]: string;
};

export interface CommonReplacement {
  replaceText: { [s: string]: CommonReplacementItem };
  replaceSync: { [s: string]: CommonReplacementWithEnItem };
}

export interface CommonReplacementModule {
  commonReplacement: CommonReplacement;
  partialCommonReplacementKeys: string[];
  syncKeys: string[];
}

export interface TimelineReplace {
  locale: keyof Locale;
  replaceText: Replacement;
  replaceSync: Replacement;
}

export interface Trigger {
  id: string;
  disabled?: boolean;
  regex?: RegExp;
  regexDe?: RegExp;
  regexFr?: RegExp;
  regexJa?: RegExp;
  regexCn?: RegExp;
  regexKo?: RegExp;
  netRegex?: RegExp;
  netRegexDe?: RegExp;
  netRegexFr?: RegExp;
  netRegexJa?: RegExp;
  netRegexCn?: RegExp;
  netRegexKo?: RegExp;
  condition?: TriggerFunction<boolean>;
  preRun?: TriggerFunction<never>;
  promise?: TriggerFunction<Promise<unknown>>;
  delaySeconds?: number | TriggerFunction<number>;
  durationSeconds?: number | TriggerFunction<number>;
  suppressSeconds?: number | TriggerFunction<number>;
  sound?: string;
  soundVolume?: number;
  response?: Locale | TriggerFunctionWithOutput<Locale>;
  alarmText?: Locale | TriggerFunctionWithOutput<Locale>;
  alertText?: Locale | TriggerFunctionWithOutput<Locale>;
  infoText?: Locale | TriggerFunctionWithOutput<Locale>;
  tts?: Locale | TriggerFunctionWithOutput<Locale>;
  run?: TriggerFunction<never>;
  outputStrings?: OutputStrings;
}

export interface TriggerSet {
  zondId?: number;
  timelineFile?: string;
  timeline?: string;
  locale?: keyof Locale;
  timelineReplace?: TimelineReplace[];
  triggers?: Trigger[];
  resetWhenOutOfCombat?: boolean;
}
