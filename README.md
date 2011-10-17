PWNBot
======

PWNBot is a modular irc bot.

## Commands

Commands are identified whenever someone writes:

    `!<command>`
    `<botname>: !<command>`
    `<botname> !<command>`

Where `<botname>` is the configured bot name (defaults to `pwnbot`), and the 
`<command` is a recognized command name.

Options can be supplied to a command in 2 possible formats:

    `<botname> !<command> <key>:<value> <key>:"<value>"`

For example, the asciimo command accepts the `font` option:

    !ascii font:banner Text to appear in the banner font.

### Creating a command

- Commands go into the `commands/` directory.
- They must export a function whose name is the command to identify.
- The exported function must return a function that handles messages.
  Said function receives the `message`, a function to write messages in the channel
  where the command was captured, an options hash, the user who emitted the command
  and the channel name, in that order.
