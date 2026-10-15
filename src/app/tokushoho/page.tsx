import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

/**
 * 特定商取引法に基づく表記 — the seller disclosure Japanese law requires of any
 * business selling to consumers at a distance, and which Stripe expects on the
 * site before live charges.
 *
 * Japanese only, by design: it is a Japanese-law notice addressed to Japanese
 * consumers, so it is NOT wired into the 8-language catalog. The content block
 * carries lang="ja" so browsers treat it as Japanese (and offer to translate
 * it) instead of reading it as mislabelled English.
 *
 * Commercial terms come first; the business details sit at the end. Prices
 * mirror tora-backend/src/config/pricing.js — update both together.
 *
 * Trimmed to the legal minimum for a 個人事業主: the Consumer Affairs Agency
 * lets an individual seller withhold the address from the page as long as it
 * undertakes to disclose it without delay on request, which is what the 所在地
 * row now says. The seller's NAME cannot be withheld and is shown plainly. The
 * phone is kept visible although it could also be withheld. The street address
 * must not reappear anywhere — not in markup, metadata or a comment.
 *
 * Deliberately not in the site chrome: reachable from the Terms page, and
 * (still owed) from the subscription screen in the app, where the purchase is
 * actually made. noindex keeps it out of search results; the law asks that
 * consumers can read the disclosure, not that search engines can.
 */

const sg = { fontFamily: "var(--font-space-grotesk), sans-serif" } as React.CSSProperties;

const PRICE_COLS = ["日本円", "ユーロ", "米ドル"];

const AGENT_BANDS = [
    ["1〜3名", "¥3,480", "€19.90", "$22.90"],
    ["4〜10名", "¥2,580", "€14.90", "$16.90"],
    ["11〜25名", "¥2,080", "€11.90", "$13.90"],
    ["26〜50名", "¥1,580", "€8.90", "$9.90"],
    ["51名以上", "¥1,180", "€6.90", "$7.90"],
];

function PriceTable({ head, rows }: { head: string; rows: string[][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full max-w-md border-collapse text-left text-[13px] md:text-base">
                <thead>
                    <tr className="text-white/45">
                        <th className="whitespace-nowrap py-1 pr-3 font-normal md:pr-4">{head}</th>
                        {PRICE_COLS.map((c) => (
                            <th key={c} className="py-1 pr-3 font-normal last:pr-0 md:pr-4">{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r[0]}>
                            <td className="whitespace-nowrap py-1 pr-3 text-white/60 md:pr-4">{r[0]}</td>
                            {r.slice(1).map((v, i) => (
                                <td key={i} className="py-1 pr-3 last:pr-0 md:pr-4">{v}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const ROWS: { term: string; body: React.ReactNode }[] = [
    {
        term: "販売URL",
        body: <a href="https://app.torahub.io" className="text-infrared hover:underline">https://app.torahub.io</a>,
    },
    {
        term: "販売価格",
        body: (
            <div className="space-y-5">
                <div>
                    <div className="mb-2 text-white">TORA Premium（アーティスト／プロモーター／ベニュー）</div>
                    <PriceTable head="" rows={[["月額", "¥3,480", "€19.90", "$22.90"], ["年額", "¥34,800", "€199.90", "$229.90"]]} />
                </div>

                <div>
                    <div className="mb-2 text-white">エージェント（所属アーティスト1名あたりの月額）</div>
                    <PriceTable head="人数" rows={AGENT_BANDS} />
                    <p className="mt-2 text-sm text-white/45">
                        所属アーティスト数に応じて区分ごとの単価を合算して算出します。年額は月額10か月分です。
                    </p>
                </div>

                <p className="text-sm text-white/45">
                    表示価格は消費税等を含む総額です。お支払い時にこれ以外の税金が加算されることはありません。
                    ご請求通貨は初回お申し込み時にご登録国に応じて日本円・ユーロ・米ドルのいずれかに決定され、以降変更されません。
                    このほか、一部の機能について単発でご購入いただける追加オプション（¥350〜¥2,080）がございます。
                </p>
            </div>
        ),
    },
    {
        term: "商品代金以外の必要料金",
        body: "本サービスのご利用に必要なインターネット接続料金および通信料金はお客様のご負担となります。これ以外に当方が申し受ける費用はありません。",
    },
    { term: "支払方法", body: "クレジットカード決済（決済代行事業者：Stripe）" },
    { term: "支払時期", body: "お申し込み時に初回のお支払いが発生し、以降は各更新日に自動的に課金されます。" },
    { term: "役務の提供時期", body: "決済の確認後、直ちにご利用いただけます。" },
    {
        term: "返品・キャンセルについて",
        body: "本サービスはデジタルコンテンツの提供であるため、提供開始後の返金は法令に定めがある場合を除き承っておりません。お客様はアプリ内の設定からいつでも解約でき、解約後もお支払い済みの期間が終了するまで引き続きご利用いただけます。",
    },
    {
        term: "動作環境",
        body: "Google Chrome、Safari、Microsoft Edge、Mozilla Firefox の各最新版、および TORA の iOS／Android アプリ。",
    },
    { term: "事業者名", body: "TORA（屋号）／ Alessandro Castelbuono" },
    {
        term: "所在地",
        body: (
            <>
                ご請求があれば遅滞なく開示いたします。support@torahub.io までご連絡ください。
                <span className="mt-1 block text-sm text-white/45">
                    Disclosed without delay on request — write to support@torahub.io.
                </span>
            </>
        ),
    },
    { term: "電話番号", body: "+81 70-2030-2095" },
    {
        term: "メールアドレス",
        body: <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>,
    },
];

export default function Tokushoho() {
    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="mx-auto max-w-4xl space-y-12 px-8 pb-20 pt-32">
                <div className="space-y-4 text-center">
                    <AnimatedTitle>特定商取引法に基づく表記</AnimatedTitle>
                    <p className="text-sm uppercase tracking-widest text-white/40" style={{ fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" }}>
                        Specified Commercial Transactions Act
                    </p>
                </div>

                <div lang="ja" className="prose prose-invert max-w-none space-y-4 leading-relaxed text-white/70" style={sg}>
                    {ROWS.map((row) => (
                        <div key={row.term}>
                            <h3 className="mt-6 font-tech text-lg font-semibold text-white">{row.term}</h3>
                            <div className="mt-2">{row.body}</div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/terms" className="text-xs uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white" style={sg}>
                        &lsaquo; Terms of Service
                    </Link>
                </div>
                <PageBrand />
            </div>
            <BottomNav />
        </main>
    );
}
