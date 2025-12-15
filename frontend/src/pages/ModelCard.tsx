import React from 'react';
import { Layout } from '../components/common/Layout';

export const ModelCard: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Card</h1>
          <p className="text-gray-600">DistilBERT for Fake News Detection</p>
        </div>

        {/* Model Details */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.1. Model Details</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="font-semibold">Organization developing the model:</span> HuggingFace
            </div>
            <div>
              <span className="font-semibold">Model date:</span> 2019-10-02
            </div>
            <div>
              <span className="font-semibold">Model version:</span> distil_bert_base_en_uncased v3
            </div>
            <div>
              <span className="font-semibold">Model type:</span> Transformer-based language model
            </div>
            <div>
              <span className="font-semibold">Information about applied approaches and features:</span>
              <ul className="list-disc ml-6 mt-2">
                <li>Pretrained using a masked language modeling objective.</li>
                <li>Knowledge distillation from Bidirectional Encoder Representations from Transformers (BERT) model.</li>
              </ul>
            </div>
            <div>
              <span className="font-semibold">Citation details:</span> Sanh, V., Debut, L., Chaumond, J., & Wolf, T. (2019). 
              DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter. arXiv preprint arXiv:1910.01108.
            </div>
            <div>
              <span className="font-semibold">License:</span> Apache 2.0
            </div>
          </div>
        </section>

        {/* Intended Use */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.2. Intended Use</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2.1. Primary Intended Uses</h3>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>General purpose language understanding tasks (e.g., text classification, sentiment analysis, question answering).</li>
            <li>Designed for use in scenarios where slightly lower accuracy than BERT is acceptable with significantly lower computational cost.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2.2. Primary Intended Users</h3>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>Developers looking to use a natural language processing (NLP) model with constrained resources.</li>
            <li>NLP researchers or practitioners requiring an efficient pretrained model.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2.3. Out-of-scope Use Cases</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Use as a generative model.</li>
            <li>Use for sensitive or high stakes decision-making.</li>
            <li>Use on non-English texts.</li>
          </ul>
        </section>

        {/* Factors */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.3. Factors</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3.1. Relevant Factors</h3>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>This version of DistilBERT was trained only on English. It is not expected to perform well on other languages or dialects.</li>
            <li>Political or cultural biases may be inherited from the data set used for pretraining.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3.2. Evaluation Factors</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Evaluated on GLUE benchmark tasks (entailment, sentiment, paraphrase, etc.)</li>
            <li>GLUE does not include demographic or intersectional annotations.</li>
          </ul>
        </section>

        {/* Metrics */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.4. Metrics</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4.1. Model Performance Measures</h3>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>DistilBERT's performance is primarily measured using accuracy and F1-score on the GLUE benchmark tasks, which evaluate general English language understanding.</li>
            <li>These metrics were chosen because they capture overall model correctness and balance between precision and recall in text classification.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4.2. Decision Thresholds</h3>
          <p className="ml-6 mb-4 text-gray-700">
            No thresholds are used in the base model. Downstream applications define these for their specific tasks.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4.3. Variation Approaches</h3>
          <p className="ml-6 text-gray-700">
            Medians of 5 runs with different seeds are used to reduce the impact of variability.
          </p>
        </section>

        {/* Evaluation Data */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.5. Evaluation Data</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5.1. Datasets</h3>
          <p className="mb-3 text-gray-700">
            General Language Understanding Evaluation (GLUE) benchmark, a collection of 9 English NLP tasks:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Task</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Corpus of Linguistic Accessibility (CoLA)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine grammatical correctness.</td>
                  <td className="border border-gray-300 px-4 py-2">Matthews correlation coefficient</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Stanford Sentiment Treebank (SST-2)</td>
                  <td className="border border-gray-300 px-4 py-2">Binary sentiment analysis of movie reviews.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Microsoft Research Paraphrase Corpus (MRPC)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine semantic equivalence of two sentences.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy and F1-score</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Semantic Textual Similarity Benchmark (STS-B)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine degree of similarity between two sentences.</td>
                  <td className="border border-gray-300 px-4 py-2">Pearson and Spearman correlation</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Quora Question Pairs (QQP)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine semantic equivalence of two questions.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy and F1-score</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Multi-Genre Natural Language Inference (MNLI)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine if a sentence is entailed, contradicted or neither by a previous sentence.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Question Natural Language Inference (QNLI)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine if a sentence correctly answers a question.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Recognizing Textual Entailment (RTE)</td>
                  <td className="border border-gray-300 px-4 py-2">Determine if a sentence is entailed or not by a previous sentence.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Winograd Natural Language Inference (WNLI)</td>
                  <td className="border border-gray-300 px-4 py-2">Resolve ambiguity in sentences.</td>
                  <td className="border border-gray-300 px-4 py-2">Accuracy</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5.2. Motivation</h3>
          <p className="ml-6 mb-4 text-gray-700">
            GLUE provides a standardized, diverse test suite for benchmarking language understanding models across a variety of NLP tasks.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5.3. Preprocessing</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Text converted to lowercase.</li>
            <li>Tokenized using the WordPiece tokenizer.</li>
            <li>Sentences truncated to 512 tokens.</li>
          </ul>
        </section>

        {/* Training Data */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.6. Training Data</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.6.1. Datasets</h3>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>English Wikipedia.</li>
            <li>Toronto BookCorpus, a dataset of around 7000 self-published books.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.6.2. Motivation</h3>
          <ul className="list-disc ml-6 mb-4 text-gray-700">
            <li>Wikipedia: Provides factual coverage on a wide variety of topics.</li>
            <li>BookCorpus: Offers narrative and conversational language, differing from Wikipedia's highly formal tone.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.6.3. Preprocessing</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Text converted to lowercase.</li>
            <li>Tokenized using the WordPiece tokenizer.</li>
            <li>Sentences truncated to 512 tokens.</li>
          </ul>
        </section>

        {/* Quantitative Analysis */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.7. Quantitative Analysis</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.7.1. Unitary Results</h3>
          <p className="ml-6 mb-4 text-gray-700">
            Overall it performs to 97% the level of BERT across the 9 tasks in the GLUE benchmark.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.7.2. Intersectional Results</h3>
          <p className="ml-6 text-gray-700">
            No official intersectional evaluation has been reported for DistilBERT.
          </p>
        </section>

        {/* Ethical Considerations */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.8. Ethical Considerations</h2>
          <p className="text-gray-700">
            No explicit risk mitigation was applied in pretraining, users are responsible for applying these in their downstream applications.
          </p>
        </section>

        {/* Caveats and Recommendations */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3.9. Caveats and Recommendations</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Further testing on diverse datasets beyond GLUE should be performed to assess generalization of the model to different domains.</li>
            <li>Users should verify fairness and bias of their application of the model independently.</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};
