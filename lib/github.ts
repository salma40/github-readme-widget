export async function getGitHubStats(username: string) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
const res = await fetch("https://api.github.com/graphql", { //sends a network req to GraphQL endpoint
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, //reads from .env file
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,  //this is the data we are sending
      },
    }),
  });
const json = await res.json();
if (!json.data?.user) {
  console.log("GitHub response:", res.status, JSON.stringify(json));
  throw new Error("GitHub API error: " + JSON.stringify(json));
}
const calendar =
    json.data.user.contributionsCollection.contributionCalendar;

  const days = calendar.weeks.flatMap(
    (week: any) => week.contributionDays
  );
const currentStreak = calculateCurrentStreak(days);

  return {
    currentStreak,
  };
}
function calculateCurrentStreak(days: any[]) {
  let streak = 0;

  // reverse the array to start from the newest day
  const reversed = [...days].reverse();
let startIndex = 0;
// here we check if there was a commit activity from the day before bcuz GitHub considers streak alive if day isn’t over yet!
  if (
    reversed.length > 0 &&
    reversed[0].contributionCount === 0
  ) {
    startIndex = 1; //start counting streak on day b4 newest day
  }
for (let i = startIndex; i < reversed.length; i++) {
    if (reversed[i].contributionCount > 0) {
      streak++; //if day has contributions keep checking
    } else {
      break; //break the loop if a day has zero contributions
    }
  }

  return streak;
}