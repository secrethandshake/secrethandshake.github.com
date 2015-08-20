module.exports = {
  // your community or team name to display on join page.
  community: process.env.COMMUNITY_NAME || 'Secret Handshake',
  // your slack team url (ex: socketio.slack.com)
  slackUrl: process.env.SLACK_URL || 'secrethandshake.slack.com',
  // access token of slack
  // You can generate it in https://api.slack.com/web#auth
  //
  // You can test your token via curl:
  //   curl -X POST 'https://YOUR-SLACK-TEAM.slack.com/api/users.admin.invite' \
  //   --data 'email=EMAIL&token=TOKEN&set_active=true' \
  //   --compressed
  slacktoken: process.env.SLACK_TOKEN || 'xoxp-2355780676-8118433015-8204872977-23fbfc'
};