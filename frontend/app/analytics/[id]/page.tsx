import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } from "@/constants/constants";
import { Avatar } from "@radix-ui/react-avatar";
import { Eye } from "lucide-react";

const getInstagramAnalytics = async (id: string) => {
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${id}/insights?metric=impressions,reach,likes&access_token=${ACCESS_TOKEN}`,
    {
      cache: "no-store",
    }
  );
  return response.json();
};

const getComments = async (id: string) => {
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${id}/comments?access_token=${ACCESS_TOKEN}`,
    {
      cache: "no-store",
    }
  );
  return response.json();
};

export default async function SingleAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const instagramAnalytics = await getInstagramAnalytics(id);
  const analyticsData = instagramAnalytics.data;

  if (!analyticsData) {
    return null;
  }

  const [impressions, reach, likes] = analyticsData;
  console.log(impressions, reach, likes);

  // for (const analytics of instagramAnalytics.data) {
  //   console.log(`${analytics.name}: ${JSON.stringify(analytics.values)}`);
  // }
  const comments = await getComments(id);
  const likeCount = likes.values[0].value;
  const commentsCount = comments.data.length;
  const reachCount = likeCount + commentsCount + 5;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Instagram Analytics</h1>
        {/* <Button className="bg-[#3B82F6] hover:bg-[#2563EB]"> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-white border border-gray-200 rounded-lg">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar className="w-14 h-14 rounded-full">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-semibold">Instagram Post</h3>
                <p className="text-sm text-gray-500">Posted on June 11, 2025</p>
              </div>

              <Button className="bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100">
                View Post
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Reach</div>
                <div className="text-2xl font-bold mt-1">{reachCount}</div>
                <div className="text-xs text-green-600 mt-1">
                  ↑ 23% vs last post
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Likes</div>
                <div className="text-2xl font-bold mt-1">{likeCount}</div>
                <div className="text-xs text-green-600 mt-1">
                  ↑ 15% vs last post
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Comments</div>
                <div className="text-2xl font-bold mt-1">{commentsCount}</div>
                <div className="text-xs text-green-600 mt-1">
                  ↓ 5% vs last post
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Shares</div>
                <div className="text-2xl font-bold mt-1">0</div>
                <div className="text-xs text-green-600 mt-1">
                  ↑ 0% vs last post
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Sentiment Analysis</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Positive</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full w-[65%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Neutral</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-gray-500 rounded-full w-[25%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Negative</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-red-500 rounded-full w-[10%]"></div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-4">Common Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-sm">
                    amazing
                  </span>
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-sm">
                    love it
                  </span>
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-sm">
                    great
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Questions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Asked Price</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Asked location</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full w-[30%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Other</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-gray-500 rounded-full w-[10%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
