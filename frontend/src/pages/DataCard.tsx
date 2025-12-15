import React from 'react';
import { Layout } from '../components/common/Layout';

export const DataCard: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Card</h1>
          <p className="text-gray-600">ISOT Fake News Detection Dataset</p>
        </div>

        {/* Dataset Description */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4.1. Dataset Description</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="font-semibold">Homepage:</span>{' '}
              <a href="https://www.kaggle.com/datasets/emineyetm/fake-news-detection-datasets" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                Kaggle - Fake News Detection Datasets
              </a>
            </div>
            <div>
              <span className="font-semibold">Repository:</span> Kaggle
            </div>
            <div>
              <span className="font-semibold">Dataset Authors:</span> Ahmed, H., Traore, I. & Saad, S. (ISOT Research Group)
            </div>
            <div>
              <span className="font-semibold">Paper:</span> Ahmed, H., Traore, I., & Saad, S. (2017). 
              Detection of Online Fake News Using N-Gram Analysis and Machine Learning Techniques. 
              Springer, Lecture Notes in Computer Science, Vol. 10618, pp. 127–138.
            </div>
            <div>
              <span className="font-semibold">Uploader & Point of Contact:</span> Emine Bozkus, PhD (dataset creator, Kaggle Profile: @emineyetm), 
              emineeytm@gmail.com
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1.1. Dataset Summary</h3>
          <div className="text-gray-700 space-y-3">
            <p>
              The ISOT Fake News Dataset is a collection of English-language news articles labeled as real or fake. 
              It was developed to support fake news detection and text classification tasks in natural language processing.
            </p>
            <ul className="list-disc ml-6">
              <li>Real news: collected from Reuters.com (trusted source).</li>
              <li>Fake news: collected from unreliable sources identified by PolitiFact and Wikipedia.</li>
              <li>Topics covered: Politics, world news, government, and US-related current events.</li>
              <li>Intended use: training and evaluation of machine learning models for misinformation detection.</li>
            </ul>
            <p>
              This dataset was created to help researchers build models that distinguish factual reporting from 
              misinformation using linguistic and stylistic cues. The dataset is balanced, diverse, and suitable 
              for training transformer-based architectures (e.g., DistilBERT, BERT, LSTM, CNN). It focuses 
              primarily on political and world news published between 2016 and 2017.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1.2. Languages</h3>
          <p className="text-gray-700">
            The dataset language is mainly English. There are varieties such as North American English and 
            standard international English. The style of the language depends on formal journalistic writing 
            and online news articles.
          </p>
        </section>

        {/* Dataset Structure */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4.2. Dataset Structure</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2.1. Data Fields</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Field Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                <tr>
                  <td className="border border-gray-300 px-4 py-2">title</td>
                  <td className="border border-gray-300 px-4 py-2">Headline of the news article</td>
                  <td className="border border-gray-300 px-4 py-2">String</td>
                  <td className="border border-gray-300 px-4 py-2">Input</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">text</td>
                  <td className="border border-gray-300 px-4 py-2">Main body of the article</td>
                  <td className="border border-gray-300 px-4 py-2">String</td>
                  <td className="border border-gray-300 px-4 py-2">Input</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">subject</td>
                  <td className="border border-gray-300 px-4 py-2">The article category (e.g., Politics, World news, US news)</td>
                  <td className="border border-gray-300 px-4 py-2">String</td>
                  <td className="border border-gray-300 px-4 py-2">Auxiliary</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">date</td>
                  <td className="border border-gray-300 px-4 py-2">Date of publication</td>
                  <td className="border border-gray-300 px-4 py-2">Date</td>
                  <td className="border border-gray-300 px-4 py-2">Metadata</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">label</td>
                  <td className="border border-gray-300 px-4 py-2">1=Real, 0=Fake</td>
                  <td className="border border-gray-300 px-4 py-2">Integer</td>
                  <td className="border border-gray-300 px-4 py-2">Target Output</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2.1.1. Data Composition</h3>
          <p className="text-gray-700 mb-4">
            The dataset contains a total of 44,898 news records and these records' text fields are non-null and 
            plain English sentences. Each record includes both title and article content; some titles repeat 
            across sources. The dataset balances roughly 48% real and 52% fake news.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2.2. Data Splits (for Model Training)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Split</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Train</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Validation</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Test</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Input Sentences</td>
                  <td className="border border-gray-300 px-4 py-2">31,428 (70%)</td>
                  <td className="border border-gray-300 px-4 py-2">6,734 (15%)</td>
                  <td className="border border-gray-300 px-4 py-2">6,734 (15%)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Average Sentence Length</td>
                  <td className="border border-gray-300 px-4 py-2">405.45</td>
                  <td className="border border-gray-300 px-4 py-2">403.54</td>
                  <td className="border border-gray-300 px-4 py-2">410.84</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Dataset Creation */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4.3. Dataset Creation</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3.1. Curation Rationale</h3>
          <p className="text-gray-700 mb-6">
            The dataset was designed to help researchers and students develop automatic fake news detection 
            models using textual data only (without images, URLs, or metadata). It provides an accessible, 
            high-quality corpus for supervised learning.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3.2. Source Data</h3>
          <p className="text-gray-700 mb-4">
            This section describes the source of the news text and headlines used in the dataset, including 
            how they were collected, normalized, and produced.
          </p>

          <h4 className="text-lg font-semibold text-gray-800 mb-2">4.3.2.1. Initial Data Collection and Normalization</h4>
          <p className="text-gray-700 mb-6">
            The period of the collection process is between 2016 and 2017. Real news gathered from Reuters.com, 
            meanwhile fake news collected from various untrustworthy online publishers identified by PolitiFact 
            and Wikipedia.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3.3. Annotations</h3>
          <p className="text-gray-700 mb-4">
            The dataset includes binary labels that indicate whether each news article is real or fake. These 
            labels were not manually assigned by annotators but rather determined automatically based on the 
            source credibility of the news articles.
          </p>

          <h4 className="text-lg font-semibold text-gray-800 mb-2">4.3.3.1. Annotation Process</h4>
          <div className="text-gray-700 space-y-3 mb-4">
            <p>
              The annotation process was fully automated. Articles were collected and labeled according to the 
              reliability of the source websites:
            </p>
            <ul className="list-disc ml-6">
              <li>Articles obtained from Reuters.com were annotated as Real News (label = 1).</li>
              <li>Articles obtained from unreliable or unverified sources listed by PolitiFact and Wikipedia 
                  were annotated as Fake News (label = 0).</li>
            </ul>
            <p><span className="font-semibold">Amount annotated:</span></p>
            <ul className="list-disc ml-6">
              <li>100% of the dataset (44,898 articles) was labeled automatically.</li>
            </ul>
            <p><span className="font-semibold">Validation process:</span></p>
            <p className="ml-6">
              To ensure correctness, the ISOT research team conducted random checks on a subset of articles 
              to confirm that the collected URLs matched their assigned categories.
            </p>
            <p className="ml-6">
              No manual relabeling was necessary, and no inter-annotator disagreement statistics apply since 
              human annotators were not involved.
            </p>
            <p><span className="font-semibold">Annotation format:</span></p>
            <p className="ml-6">Each record includes the following fields:</p>
            <ul className="list-disc ml-12">
              <li>title (string)</li>
              <li>text (string)</li>
              <li>subject (string)</li>
              <li>date (datetime)</li>
              <li>label (binary integer: 1 = Real, 0 = Fake)</li>
            </ul>
          </div>

          <h4 className="text-lg font-semibold text-gray-800 mb-2">4.3.3.2. Who Are the Annotators?</h4>
          <div className="text-gray-700 space-y-3">
            <p>
              The labeling was produced by the ISOT Research Group at the University of Victoria, through a 
              machine-based labeling process that used predefined source lists.
            </p>
            <ul className="list-disc ml-6">
              <li><span className="font-semibold">Annotator type:</span> Automated system, guided by curated source credibility lists.</li>
              <li><span className="font-semibold">Selection criteria:</span> Each source was cross-referenced against PolitiFact's 
                  and Wikipedia's lists of unreliable publishers.</li>
              <li><span className="font-semibold">Human involvement:</span> None during annotation; only during validation and publication review.</li>
              <li><span className="font-semibold">Compensation:</span> Not applicable, as this dataset relies on publicly available 
                  web content and automated classification.</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3.4. Personal and Sensitive Information</h3>
          <div className="text-gray-700 space-y-3">
            <p>
              The ISOT Fake News Dataset does not contain any personal or sensitive information related to 
              identifiable individuals.
            </p>
            <p>
              All news articles in the dataset are collected from publicly available websites and represent 
              published journalistic content rather than user-generated data or private communications.
            </p>
            <ul className="list-disc ml-6">
              <li><span className="font-semibold">Identity categories:</span> The dataset does not contain any features 
                  that directly (such as names, email addresses, or usernames) or indirectly (such as demographic 
                  characteristics, geographic coordinates, or affiliations) identify individuals.</li>
              <li><span className="font-semibold">Sensitive features:</span> The dataset does not contain any information 
                  that could reveal individuals' racial or ethnic origin, sexual orientation, religious beliefs, 
                  political views, union membership, health or financial information, biometric or genetic data, 
                  or official identification numbers.</li>
              <li><span className="font-semibold">Political issues:</span> While the dataset includes political news articles, 
                  the text reflects publicly available journalistic content, not the private opinions or personal data 
                  of any individual. The (Fact/Fake) label refers only to the credibility of the article source, not 
                  to any individual or political figure.</li>
              <li><span className="font-semibold">Anonymization:</span> Because the dataset inherently does not contain 
                  personal identifiers, no anonymization was required. However, a minor cleanup was performed to remove 
                  embedded hyperlinks, email signatures, or publisher-specific metadata that might indirectly point to 
                  the original URLs or editors.</li>
            </ul>
            <p>
              In summary, the dataset is fully suitable for ethical research use because it contains only textual 
              content from open-access news sources and no personal, confidential, or sensitive data.
            </p>
          </div>
        </section>

        {/* Considerations for Using the Data */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4.4. Considerations for Using the Data</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4.1. Discussion of Biases</h3>
          <div className="text-gray-700 space-y-3 mb-6">
            <p>
              While the ISOT Fake News Dataset is widely used in fake news detection research, several potential 
              biases arise from the collection and labeling process:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <span className="font-semibold">Cultural and Geographic Bias:</span> Most of the articles come from 
                Western sources, primarily the United States and other English-speaking countries. This regional 
                concentration may limit the model's generalization to news written in different cultural or linguistic contexts.
              </li>
              <li>
                <span className="font-semibold">Temporal Bias:</span> The dataset includes articles published between 
                2016 and 2017, a period of high political polarization. As a result, language patterns and topics from 
                that period (e.g., US elections, international conflicts) may differ from current misinformation trends. 
                Models trained on this dataset may perform less effectively on more recent content.
              </li>
              <li>
                <span className="font-semibold">Source Bias:</span> Labeling is based on the credibility of the source 
                (e.g., Reuters = Real, flagged websites = Fake). This assumption simplifies the labeling process but can 
                encode institutional bias; some untrustworthy sites may occasionally publish genuine information, while 
                reputable organizations may occasionally make mistakes.
              </li>
              <li>
                <span className="font-semibold">Topic Imbalance:</span> While most fake news articles in the dataset are 
                political, real news covers a broader range of topics. This can cause classifiers to disproportionately 
                associate certain keywords or topics (such as "government," "election," or "Trump") with fake news.
              </li>
            </ul>
            <p className="mt-4">
              <span className="font-semibold">Mitigation Measures:</span> The dataset creators balanced the number of 
              fake and real articles to reduce class imbalance. This project also incorporates cross-validation, topic 
              diversity sampling, and data enrichment to increase model robustness and mitigate bias.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4.2. Other Known Limitations</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <span className="font-semibold">Binary Label Simplification:</span> The dataset represents news credibility 
              with a binary label (Fake = 0, True = 1), which oversimplifies the complex nature of misinformation. It does 
              not account for partially true stories, satire, or opinion pieces.
            </li>
            <li>
              <span className="font-semibold">Lack of Metadata:</span> The dataset does not include contextual data such 
              as author, source URL, engagement metrics, or publication location. This limits the ability to analyze tone- 
              or network-based misinformation patterns.
            </li>
            <li>
              <span className="font-semibold">Limited Multilingual Coverage:</span> The dataset only contains English articles. 
              Therefore, the models cannot be generalized to non-English or mixed-language news data.
            </li>
            <li>
              <span className="font-semibold">Outdated Context:</span> Because the dataset was collected more than three years 
              ago, it may not capture current fake news trends (e.g., AI-generated misinformation or deepfakes).
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            Therefore, while the ISOT dataset remains a valuable resource for fake news detection research, users should 
            interpret its results with caution and consider its cultural, temporal, and structural limitations.
          </p>
        </section>

        {/* Additional Information */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4.5. Additional Information</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.5.1. Dataset Curators</h3>
          <div className="text-gray-700 space-y-3 mb-6">
            <p>
              The ISOT Fake News Dataset was curated by the Information Security and Object Technology (ISOT) Research 
              Group at the University of Victoria, Canada.
            </p>
            <p>
              <span className="font-semibold">Principal Investigators:</span> From University of Victoria, Canada; 
              H. Ahmed, I. Traore and S. Saad
            </p>
            <p>
              <span className="font-semibold">Kaggle Contributor:</span> Emine Bozkus, PhD who uploaded and maintained 
              the dataset version available on Kaggle.
            </p>
            <p>
              No specific funding source was disclosed for the dataset collection or Kaggle distribution.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.5.2. Licensing Information</h3>
          <div className="text-gray-700 space-y-2 mb-6">
            <p><span className="font-semibold">License:</span> Unknown (no explicit license specified on the Kaggle dataset page).</p>
            <p><span className="font-semibold">Usage:</span> The dataset is intended for research and educational purposes only.</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.5.3. Citation Information</h3>
          <div className="text-gray-700 space-y-3 mb-6">
            <p className="font-semibold">Dataset Source:</p>
            <p className="ml-6 text-sm">
              Bozkus, E. (2022). Fake News Detection Datasets (ISOT Dataset). Kaggle. 
              Retrieved from <a href="https://www.kaggle.com/datasets/emineyetm/fake-news-detection-datasets" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline">
                https://www.kaggle.com/datasets/emineyetm/fake-news-detection-datasets
              </a>
            </p>
            <p className="font-semibold mt-4">Original Research Papers:</p>
            <div className="ml-6 text-sm space-y-2">
              <p>
                Ahmed, H., Traore, I., & Saad, S. (2017). Detection of Online Fake News Using N-Gram Analysis 
                and Machine Learning Techniques. In Intelligent, Secure, and Dependable Systems in Distributed 
                and Cloud Environments (ISDDC), Springer LNCS, Vol. 10618, pp. 127–138.
              </p>
              <p>
                Ahmed, H., Traore, I., & Saad, S. (2018). Detecting Opinion Spams and Fake News Using Text 
                Classification. Journal of Security and Privacy, Wiley, Vol. 1, Issue 1.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.5.4. Contributions</h3>
          <p className="text-gray-700">
            Thanks to Emine Bozkus, PhD for uploading and maintaining the Kaggle version of the ISOT Fake News Dataset. 
            Additional thanks to the ISOT Research Group for the original dataset development and publication.
          </p>
        </section>
      </div>
    </Layout>
  );
};
