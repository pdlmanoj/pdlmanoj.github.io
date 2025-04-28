var store = [{
        "title": "Processing tips of huggingface datasets",
        "excerpt":"Tips-1: Take sample of data from datasets from datasets import load_dataset dataset = load_dataset(\"data_name\", split=\"split_name\") # randomize the data shuffled_dataset = dataset.shuffle(seed=42) sample_size = 500 sampled_dataset = shuffled_dataset['train'].select(range(sample_size)) # now process this sampled_dataset according to your needs Tips-2: Apply map over the datasets from datasets import load_dataset dataset = load_dataset(\"data_name\",...","categories": ["python","datasets","large file processing"],
        "tags": [],
        "url": "/2024/04/huggingface-datasets-processing/",
        "teaser": null
      }]
