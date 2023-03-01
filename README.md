# aigc

Generate content for you with OpenAI


## Installation

> require `node >= 14`


```bash
npm i -g aigc
```

## Usage

The library needs to be configured with your account's secret key which is available on the [website](https://beta.openai.com/account/api-keys). Set it as the `OPENAI_API_KEY` environment variable before using the library:

```bash
export OPENAI_API_KEY='sk-...'
```

### Command-line interface

This library additionally provides an `aigc` command-line utility which makes it easy to interact with the API from your terminal. Run `aigc -h` for usage.

```bash
# list models
aigc list-models
# create a completion
aigc --prompt "Write unit test for the code below" path/to/your/codeFile
```


<!--
## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.
-->

## Changelog

[Changelog](./CHANGELOG.md)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License

[MIT](https://choosealicense.com/licenses/mit/)
