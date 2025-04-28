---
title: "Processing tips of huggingface datasets"
date: 2024-04-04
categories:
  - python
  - datasets
  - large file processing
classes: wide
excerpt: In this blog I will note down some tips to process huggingface datasets
---

## Tips-1: Take sample of data from datasets
```py
from datasets import load_dataset

dataset = load_dataset("data_name", split="split_name")

# randomize the data
shuffled_dataset = dataset.shuffle(seed=42)

sample_size = 500
sampled_dataset = shuffled_dataset['train'].select(range(sample_size))

# now process this sampled_dataset according to your needs

```

## Tips-2: Apply map over the datasets
```py
from datasets import load_dataset

dataset = load_dataset("data_name", split="split_name")

def tokenize_data(example):
  tokens = example['text'].split()
  example['tokens'] = tokens
  return example
  # you can return a new example dictionary to save momory just like
  # return {'tokens': tokens}

num_proc = 10 # number of processing (multiprocessing purpose)
tokenize_dataset = dataset.map(tokenize_data, num_proc=num_proc)

```

## Upload large data to hub
- Load the large datasets
- Shard and save the datasets to local disk

  ```py
  from datasets import load_dataset

  dataset = load_dataset(
      "json",
      data_files="/path/largedata.jsonl",
      cache_dir="/path/cached"
  )

  dataset.save_to_disk("/path/mybndatasets", max_shard_size="10GB", num_proc=64)

  ```

- rename all data files to `train-**-**.arrow` format instead of `data-**-**.arrow` format
- clone the huggingface dataset repository and move all the files to `data` folder
- commit and push the datasets
- Repository directory structure will be following

  ```
  data/
    train-00000-of-00001.arrow
    test-00000-of-00001.arrow
  .gitattributes
  
  ```

## Save dataset as CSV
```py
import pandas as pd
from datasets import load_dataset


dataset = load_dataset('hishab/boolq_bn')

df = pd.DataFrame(dataset['validation'])
df.to_csv('test.csv', index=False)
```

## Dataset Subset and Split
This is the best option for pushing datasets to hub

```py
from datasets import Dataset, DatasetDict
# load datasets from jsonl files
mydata = Dataset.from_json(
    "/path/mydataset/*.jsonl",
    cache_dir="/path/cache_dir"
)
mydata2 = Dataset.from_json(
    "/path/mydataset2/*.jsonl",
    cache_dir="/path/cache_dir"
)
# now add category and split
# Create the main dataset dictionary with subsets
mydata_dict = DatasetDict({
    "train": mydata
})

mydata1_dict = DatasetDict({
    "train": mydata1
})

# push to hub
mydata_dict.push_to_hub("sagor/mydata", config_name="mydata")
mydata1_dict.push_to_hub("sagor/mydata", config_name="mydata1")

```
In viewer it will show Subset as the mydata and mydata2 and split for mydata as train

NB: You need to login huggingface by

`huggingface-cli login`

## Git LFS problem for JSONL file
If you clone repo and push by git then this option might help

- Before adding file `git lfs install`
- Also do this `huggingface-cli lfs-enable-largefiles .`
- For `JSONL` file update .gitattribute file by `git lfs track "*.jsonl"`
- Now add, commit and push

