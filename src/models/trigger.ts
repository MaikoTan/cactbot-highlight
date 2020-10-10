export interface Locale {
    en?: string;
    de?: string;
    fr?: string;
    ja?: string;
    cn?: string;
    ko?: string;
}

type TriggerFunction<T> = (data: unknown, matches?: RegExpMatchArray) => T;

export interface Replacement {
    [s: string]: string;
}

export type CommonReplacementItem = {
    [s in Exclude<keyof Locale, "en">]: string;
};

export interface CommonReplacement {
    replaceText: { [s: string]: CommonReplacementItem };
    replaceSync: { [s: string]: CommonReplacementItem };
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
    promise?: TriggerFunction<Promise<any>>;
    delaySeconds?: number | TriggerFunction<number>;
    durationSeconds?: number | TriggerFunction<number>;
    suppressSeconds?: number | TriggerFunction<number>;
    sound?: string;
    soundVolume?: number;
    response?: Locale | TriggerFunction<Locale>;
    alarmText?: Locale | TriggerFunction<Locale>;
    alertText?: Locale | TriggerFunction<Locale>;
    infoText?: Locale | TriggerFunction<Locale>;
    tts?: Locale | TriggerFunction<Locale>;
    run?: TriggerFunction<never>;
}

export interface TriggerFile {
    zondId?: number;
    timelineFile?: string;
    timeline?: string;
    locale?: keyof Locale;
    timelineReplace?: TimelineReplace[];
    triggers?: Trigger[];
    resetWhenOutOfCombat?: boolean;
}
