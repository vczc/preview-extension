declare namespace Config {
  interface FieldSource {
    value: string
    selected: boolean
  }

  interface PublishDetail {
    topic_name: string
    input: {
      [key: string]: any
    }
    output: any
  }
}
