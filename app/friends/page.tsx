import { AlertCard, Card } from '@/components/Card'
import { friends } from '@/data/navLinks'
import Image from 'next/image'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from '../seo'

export const metadata = genPageMetadata({ title: `朋友们` })

export default function FriendsPage() {
  return (
    <div className="pt-6 pb-5">
      <h1 className="mb-6 text-4xl leading-10 font-extrabold tracking-tight text-gray-700 sm:leading-14 dark:text-gray-200">
        朋友们
      </h1>
      {friends.length == 0 ? (
        <div className="flex justify-center">
          <Image alt="" src="https://http.cat/418" width={325} height={300} />
        </div>
      ) : (
        <div className="columns-1 gap-10 pt-4 sm:columns-2 lg:ml-14 [&>div]:mb-8">
          {friends.map((friend) => (
            <Card key={friend.title} title={friend.title} href={friend.href} imgUrl={friend.imgUrl}>
              {friend.description}
            </Card>
          ))}
        </div>
      )}
      {siteMetadata.friends.enable && (
        <div className="mt-10">
          <AlertCard type="primary" className="pt-4 lg:px-4">
            <details>
              <summary className="cursor-pointer">
                若您的文字也烘焙着星辰与月光，诚邀您交换一枚「奶油星云」
              </summary>
              <div className="pt-2">
                <p className="font-bold">请准备：</p>
                <ul className="list-inside list-disc py-2 pl-3">
                  <li>好听的站点名！</li>
                  <li>好玩的简介！</li>
                  <li>好吃的地址！</li>
                  <li>比例为 1:1 的，好看的图标！</li>
                </ul>
                <p>甜点车将载着您的银河碎片，缀入本店橱窗的永恒曦芒～</p>
                <Link className="leading-10 font-bold" href={siteMetadata.friends.formUrl}>
                  填写邀请函 &rarr;
                </Link>
              </div>
            </details>
          </AlertCard>
          <AlertCard type="pink" className="pt-4 lg:px-4">
            <details>
              <summary className="cursor-pointer">愿以这片「银河糖霜」点缀您的星图</summary>
              <div className="my-3 w-fit rounded-2xl border-2 border-pink-900 p-3 text-sm lg:text-base dark:border-pink-300">
                <p>
                  <strong>星星碎片收容所</strong> • Alex3236
                </p>
                <p>https://space.alex3236.moe</p>
                <p>把星星揉进面团里，用月光当裱花袋～</p>
                <p>
                  <Link className="underline underline-offset-3" href="/static/assets/favicon.png">
                    FAVICON (PNG, 512*512)
                  </Link>
                  &nbsp;或&nbsp;
                  <Link className="underline underline-offset-3" href="/static/assets/avatar.png">
                    AVATAR (PNG, 450*450)
                  </Link>
                </p>
              </div>
              <p>若愿接续这缕星轨，许我将釉色罐盏盛满暗物质曲奇，回赠至您的数据银河。</p>
              <Link className="leading-10 font-bold" href={siteMetadata.friends.formUrl}>
                填写邀请函 &rarr;
              </Link>
            </details>
          </AlertCard>
        </div>
      )}
    </div>
  )
}
