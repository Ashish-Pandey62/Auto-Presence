import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCESS_TOKEN,
  API_URL,
  INSTAGRAM_ACCOUNT_ID,
} from "@/constants/constants";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";

const getInstagramAnalytics = async (id: string) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${id}/insights?metric=impressions,reach,likes&access_token=${ACCESS_TOKEN}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch Instagram analytics");
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getComments = async (id: string) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${id}/comments?access_token=${ACCESS_TOKEN}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getSentimentResponse = async (comments: any) => {
  try {
    const response = await fetch(`${API_URL}/api/comment-analyzer/`, {
      cache: "no-cache",
      body: JSON.stringify(comments),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch sentiment response");
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function SingleAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const id = (await params).id;
    const instagramAnalytics = await getInstagramAnalytics(id);
    if (!instagramAnalytics?.data) return null;

    const comments = await getComments(id);
    if (!comments?.data) return null;

    const sentimentResponse = await getSentimentResponse(comments);
    if (!sentimentResponse?.sentiment_analysis) return null;

    const [impressions, reach, likes] = instagramAnalytics.data;
    const likeCount = likes.values[0].value;
    const commentsCount = comments.data.length;

    // Dynamic Reach Calculation Logic
    const reachCount = likeCount * 2 + commentsCount * 3;

    const sentimentData = sentimentResponse.sentiment_analysis;
    console.log("Sentiment Data:", sentimentData);

    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Instagram Analytics</h1>
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
                  <p className="text-sm text-gray-500">
                    Posted on June 11, 2025
                  </p>
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
                {["positive", "neutral", "negative"].map((key) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500 capitalize">
                        {key}
                      </span>
                      <span className="text-sm font-medium">
                        {sentimentData[key].percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className={cn(
                          `h-2 rounded-full ${
                            key === "positive"
                              ? "bg-green-500"
                              : key === "neutral"
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`
                        )}
                        style={{ width: `${sentimentData[key].percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering page:", error);
    return null;
  }
}
