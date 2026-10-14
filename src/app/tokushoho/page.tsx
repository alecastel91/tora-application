import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";

/**
 * 特定商取引法に基づく表記 — the seller disclosure Japanese law requires of any
 * business selling to consumers at a distance, and which Stripe expects on the
 * site before live charges.
 *
 * Japanese only, by design: it is a Japanese-law notice addressed to Japanese
 * consumers, so it is NOT wired into the 8-language catalog. Prices mirror
 * tora-backend/src/config/pricing.js — update both together.
 *
 * Deliberately not in the site chrome: reachable from Privacy and Terms, and
 * (required) from the subscription screen in the app, where the purchase is
 * actually made. noindex keeps it out of search results; the law asks that
 * consumers can read it, not that search engines can.
 */

const sg = { fontFamily: "var(--font-space-grotesk), sans-serif" } as React.CSSProperties;

const ROWS: { term: string; body: React.ReactNode }[] = [
    { term: "販売事業者名", body: "Alessandro Castelbuono（屋号 TORA）" },
    { term: "運営統括責任者", body: "Alessandro Castelbuono" },
    { term: "所在地", body: "〒150-0011 東京都渋谷区東3-6-22 グラマシー恵比寿212" },
    {
        term: "電話番号",
        body: (
            <>
                070-2030-2095（+81 70-2030-2095）
                <span className="mt-1 block text-white/45">受付時間：平日 10:00–18:00（日本時間）</span>
            </>
        ),
    },
    {
        term: "メールアドレス",
        body: <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>,
    },
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
                    <div className="overflow-x-auto"><table className="w-full max-w-md border-collapse text-left text-[13px] md:text-base">
                        <thead>
                            <tr className="text-white/45">
                                <th className="py-1 pr-3 md:pr-4 font-normal"></th>
                                <th className="py-1 pr-3 md:pr-4 font-normal">日本円</th>
                                <th className="py-1 pr-3 md:pr-4 font-normal">ユーロ</th>
                                <th className="py-1 font-normal">米ドル</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-1 pr-3 md:pr-4 text-white/60">月額</td>
                                <td className="py-1 pr-3 md:pr-4">¥3,480</td>
                                <td className="py-1 pr-3 md:pr-4">€19.90</td>
                                <td className="py-1">$22.90</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-3 md:pr-4 text-white/60">年額</td>
                                <td className="py-1 pr-3 md:pr-4">¥34,800</td>
                                <td className="py-1 pr-3 md:pr-4">€199.90</td>
                                <td className="py-1">$229.90</td>
                            </tr>
                        </tbody>
                    </table></div>
                </div>

                <div>
                    <div className="mb-2 text-white">エージェント（所属アーティスト1名あたりの月額）</div>
                    <div className="overflow-x-auto"><table className="w-full max-w-md border-collapse text-left text-[13px] md:text-base">
                        <thead>
                            <tr className="text-white/45">
                                <th className="whitespace-nowrap py-1 pr-3 md:pr-4 font-normal">人数</th>
                                <th className="py-1 pr-3 md:pr-4 font-normal">日本円</th>
                                <th className="py-1 pr-3 md:pr-4 font-normal">ユーロ</th>
                                <th className="py-1 font-normal">米ドル</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["1〜3名", "¥3,480", "€19.90", "$22.90"],
                                ["4〜10名", "¥2,580", "€14.90", "$16.90"],
                                ["11〜25名", "¥2,080", "€11.90", "$13.90"],
                                ["26〜50名", "¥1,580", "€8.90", "$9.90"],
                                ["51名以上", "¥1,180", "€6.90", "$7.90"],
                            ].map((r) => (
                                <tr key={r[0]}>
                                    <td className="py-1 pr-3 md:pr-4 text-white/60">{r[0]}</td>
                                    <td className="py-1 pr-3 md:pr-4">{r[1]}</td>
                                    <td className="py-1 pr-3 md:pr-4">{r[2]}</td>
                                    <td className="py-1">{r[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
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
    {
        term: "支払時期",
        body: "お申し込み時に初回のお支払いが発生し、以降は各更新日に自動的に課金されます。",
    },
    {
        term: "役務の提供時期",
        body: "決済の確認後、直ちにご利用いただけます。",
    },
    {
        term: "返品・キャンセルについて",
        body: "本サービスはデジタルコンテンツの提供であるため、提供開始後の返金は法令に定めがある場合を除き承っておりません。お客様はアプリ内の設定からいつでも解約でき、解約後もお支払い済みの期間が終了するまで引き続きご利用いただけます。",
    },
    {
        term: "動作環境",
        body: "Google Chrome、Safari、Microsoft Edge、Mozilla Firefox の各最新版、および TORA の iOS／Android アプリ。",
    },
];

export default function Tokushoho() {
    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="mx-auto max-w-4xl space-y-12 px-8 pb-20 pt-32">
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-black text-white md:text-4xl" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                        特定商取引法に基づく表記
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-white/40" style={{ fontFamily: "var(--font-supreme), var(--font-space-grotesk), sans-serif" }}>
                        Specified Commercial Transactions Act
                    </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 leading-relaxed text-white/70" style={sg}>
                    <dl className="divide-y divide-white/10">
                        {ROWS.map((row) => (
                            <div key={row.term} className="grid gap-2 py-5 md:grid-cols-[200px_1fr] md:gap-6">
                                <dt className="font-semibold text-white">{row.term}</dt>
                                <dd className="min-w-0">{row.body}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="text-center">
                    <Link href="/" className="text-xs uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white" style={sg}>
                        &lsaquo; Back
                    </Link>
                </div>
                <PageBrand />
            </div>
            <BottomNav />
        </main>
    );
}
