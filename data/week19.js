// ============================================================
// WEEK 19 — Kafka Fundamentals: Streaming Data Concepts
// Days 91–95 | 19–23 October 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK19 = [

  // ============================================================
  // DAY 91 — Batch vs Streaming & Kafka Architecture
  // ============================================================
  {
    id: "W19D1", week: 19, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-19",
    type: "lesson",
    topic: "Batch vs Streaming & Kafka Architecture: Brokers, Topics, Partitions, Offsets",
    duration: "2–3 hours",

    objectives: [
      "Explain the fundamental architectural difference between batch and streaming processing",
      "Describe Kafka's core architecture: brokers, topics, partitions, and replicas",
      "Explain what an offset is and why it matters for reading messages",
      "Identify when streaming is the right architectural choice versus batch",
    ],

    introduction: `
Every pipeline you've built since Week 13 has been BATCH: data
accumulates, then gets processed on a schedule — once a day, once
an hour. This week introduces something fundamentally different:
STREAMING, where data is processed continuously, event by event,
the moment it happens. Apache Kafka is the dominant streaming
platform in the industry — built at LinkedIn, now handling
hundreds of billions of messages a day at Netflix, Uber, and
Airbnb. Week 19 covers fundamentals only — concepts and basic
producers/consumers, not deep internals.
    `,

    mentalModel: `
MENTAL MODEL — "Checking Email Once a Day vs Getting Paged Instantly"

Batch processing is checking your email once a day — efficient,
predictable, but anything urgent waits until your next check.
Streaming is getting paged the INSTANT a critical lab value comes
back — no batching, no waiting for a scheduled window, reaction
happens the moment the event occurs. Kafka is the infrastructure
that makes "paged instantly, at the scale of millions of events
per second" actually possible.
    `,

    explanation: `
BATCH vs STREAMING — THE CORE ARCHITECTURAL DIFFERENCE
============================================================
BATCH      : data accumulates over a window of time, then a job
             processes the whole accumulated chunk at once (Weeks
             13-14's entire pipeline model)
STREAMING   : each individual event is processed as it arrives,
             continuously, with no defined "batch" boundary

Neither is universally "better" — batch is simpler, cheaper, and
perfectly adequate for daily reports; streaming is necessary when
the VALUE of information decays quickly (fraud detection, live
dashboards, real-time alerting).

KAFKA'S CORE ARCHITECTURE
==============================
BROKER     : a single Kafka server. A Kafka CLUSTER is made up of
             multiple brokers working together for scale and
             fault tolerance.
TOPIC       : a named category/feed of messages — conceptually
             similar to a table name, but for a continuous stream
             rather than static rows. e.g. "patient-vitals-stream"
PARTITION    : a topic is split into one or more partitions, each
             an ORDERED, append-only log. Partitioning is what
             allows a topic to scale across multiple brokers and
             allows multiple consumers to read in parallel.
OFFSET        : each message within a partition gets a sequential
             ID number (its offset) — consumers track which offset
             they've read up to, so they know exactly where to
             resume if they stop and restart.
REPLICA        : each partition can be copied across multiple
             brokers for fault tolerance — if one broker goes down,
             a replica on another broker still has the data.

WHY PARTITIONING MATTERS
=============================
A topic with 1 partition can only be read by ONE consumer at a
time (per consumer group) — a bottleneck. A topic with 6
partitions can be read by up to 6 consumers in parallel, each
handling a slice of the traffic. Partition count is one of the
most important scaling decisions when designing a Kafka topic.

MESSAGE ORDERING — A CRITICAL GUARANTEE, WITH A CAVEAT
============================================================
Kafka guarantees ORDER WITHIN a single partition, but NOT across
partitions. If message order matters for a given key (e.g. all
events for one specific patient must be processed in order), you
must ensure those messages always land in the SAME partition —
typically done by partitioning on a key (like patient_id).

MESSAGE RETENTION
======================
Unlike a queue that deletes a message once read, Kafka RETAINS
messages for a configured period (e.g. 7 days) regardless of
whether they've been consumed — multiple independent consumers
can read the same messages, and a NEW consumer can replay
historical messages within the retention window. This is a
fundamentally different model from traditional message queues.

WHEN TO USE STREAMING VS BATCH — A DECISION FRAMEWORK
===========================================================
Use streaming when:
  - Information loses significant value within minutes/seconds
  - You need to react to individual events, not aggregate trends
  - Multiple independent systems need the same events in real time

Use batch when:
  - A daily/hourly cadence is genuinely sufficient for the decision
    being made
  - The processing logic benefits from seeing a complete window of
    data at once (e.g. a full day's aggregation)
  - Simplicity and lower operational overhead matter more than
    latency
    `,

    clinicalConnection: `
A bedside monitor streaming a patient's heart rate continuously,
versus a nurse manually charting vitals every 4 hours, is exactly
the batch-vs-streaming distinction in clinical practice — both are
legitimate monitoring approaches, but one reacts to a dangerous
arrhythmia within seconds while the other might not notice until
the next scheduled check. Choosing which pattern fits which
clinical (or data) scenario is the same architectural judgment
call either way.
    `,

    example: `
# No code today — today is purely conceptual, but here's how the
# architecture maps onto a hospital scenario for clarity:

# Topic: "lab-results-stream"
#   Partition 0: results for patient_id hash range A
#   Partition 1: results for patient_id hash range B
#   Partition 2: results for patient_id hash range C
#
# Each partition is an ordered log:
#   Partition 0 -> [offset 0: glucose result for patient 42]
#                  [offset 1: glucose result for patient 17]
#                  [offset 2: CBC result for patient 42]
#
# A consumer reading Partition 0 always sees patient 42's two
# results in the correct relative order, because both messages
# were partitioned (likely by patient_id) into the same partition.
#
# Three brokers might each hold a replica of every partition,
# so losing one broker doesn't lose any data — another broker's
# replica takes over serving that partition's reads/writes.
    `,

    commonMistakes: [
      "Assuming Kafka guarantees global ordering across an entire topic — it only guarantees ordering WITHIN a single partition.",
      "Choosing a single partition for a high-throughput topic, creating an avoidable consumption bottleneck since only one consumer (per group) can read a given partition at a time.",
      "Assuming Kafka deletes messages once consumed, like a traditional queue — Kafka retains messages for a configured period regardless of consumption, by design.",
      "Reaching for Kafka/streaming when a simple daily batch job would genuinely be sufficient, adding real operational complexity without a corresponding benefit.",
    ],

    exercises: [
      "Write 3 sentences explaining, in your own words, the difference between a topic and a partition.",
      "Sketch a topic with 3 partitions and explain which message ordering guarantee applies, and why ordering by patient_id would require careful partition key selection.",
      "List 2 examples from your own life or work that would be 'streaming' use cases and 2 that would be 'batch' use cases, with a one-sentence justification each.",
      "Read the Kafka official Introduction and Use Cases documentation and write a 3-sentence summary of why Kafka was originally built at LinkedIn.",
    ],

    resources: [
      {
        objective: "Build the correct foundational mental model before touching code",
        items: [
          { title: "Apache Kafka Official Docs — Introduction", url: "https://kafka.apache.org/documentation/#introduction", type: "official documentation", note: "Read the Introduction, Use Cases, and Design summary — about 45 minutes. Do this before the courses below." },
          { title: "Confluent — Apache Kafka 101 (Free Official Course)", url: "https://developer.confluent.io/courses/apache-kafka/events/", type: "official free course", note: "Built by Confluent, the company behind Kafka — the best free fundamentals course available. Start today, covers topics/partitions/consumer groups with interactive exercises." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 92 — Producers, Consumers & Consumer Groups
  // ============================================================
  {
    id: "W19D2", week: 19, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-20",
    type: "lesson",
    topic: "Producers, Consumers & Consumer Groups: How Data Moves Through Kafka",
    duration: "2–3 hours",

    objectives: [
      "Explain the producer/consumer roles and how they interact with topics",
      "Describe how consumer groups enable parallel, coordinated consumption",
      "Explain partition assignment within a consumer group",
      "Understand the basic concept of consumer offset commits",
    ],

    introduction: `
Yesterday was the architecture. Today is the two roles that
actually move data through that architecture: producers
(publishing events) and consumers (reading them). Consumer groups
are the single most important concept for understanding how Kafka
SCALES consumption across multiple application instances — and
the concept you'll directly use when writing real Python code
tomorrow.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital PA System vs a Team of Triage Nurses Splitting the Floor"

A producer is like the hospital's PA system announcing events —
it doesn't know or care who's listening, it just broadcasts.
Consumers are like staff listening for relevant announcements.
A CONSUMER GROUP is a team of triage nurses who've agreed to split
the floor between them — each handles a different SECTION
(partition) so no two nurses redundantly respond to the same call,
and if one nurse is busy, the system automatically reassigns their
section to someone else still listening.
    `,

    explanation: `
PRODUCERS — PUBLISHING EVENTS
==================================
A producer is any application that PUBLISHES messages to a topic.
It chooses (or lets Kafka choose) which partition a message goes
to, typically based on a PARTITION KEY:

producer.send(
    topic="lab-results-stream",
    key=str(patient_id),     # ensures all of one patient's events
                               # land in the same partition, preserving
                               # order for that patient specifically
    value=lab_result_json,
)

If no key is provided, Kafka distributes messages round-robin (or
by a hashing strategy) across partitions — fine when ordering
doesn't matter for that data.

CONSUMERS — SUBSCRIBING AND READING
=========================================
A consumer SUBSCRIBES to one or more topics and reads messages in
order, tracking its position via offsets:

consumer.subscribe(["lab-results-stream"])
for message in consumer:
    process(message.value)
    consumer.commit()     # records "I've successfully processed
                            # up to this offset"

Committing offsets is what allows a consumer to resume from where
it left off after a restart, rather than re-processing everything
or losing its place entirely.

CONSUMER GROUPS — COORDINATED, PARALLEL CONSUMPTION
==========================================================
Multiple consumer INSTANCES can share the same group_id, forming
a CONSUMER GROUP. Kafka automatically assigns each partition of a
topic to exactly ONE consumer instance within that group at a time:

Topic "lab-results-stream" has 3 partitions.
Consumer group "lab-processor-group" has 3 running instances.
-> Kafka assigns: instance A reads partition 0, instance B reads
   partition 1, instance C reads partition 2 — true parallelism,
   each instance handling a third of the traffic.

If a 4th instance joins the same group, it sits idle (no 4th
partition to assign) until either a partition is added or another
instance leaves. If an instance crashes, Kafka REBALANCES,
reassigning its partition to a remaining instance automatically.

INDEPENDENT CONSUMER GROUPS READ INDEPENDENTLY
====================================================
A DIFFERENT consumer group (different group_id) reading the SAME
topic gets its OWN independent set of offsets — e.g. a
"dashboard-group" and a "alerting-group" can both read every
message from "lab-results-stream" completely independently,
each at their own pace, neither affecting the other's progress.
This is how Kafka supports multiple downstream systems consuming
the same event stream for entirely different purposes.

KEY TAKEAWAY — PARTITION COUNT CAPS PARALLELISM PER GROUP
================================================================
You can never have MORE active consumers usefully working within
one group than the topic has partitions — this is why partition
count (Day 1) is a genuine, upfront scaling decision, not
something to leave as an afterthought.
    `,

    clinicalConnection: `
Two independent consumer groups reading the same lab-results
stream — one updating a live clinician dashboard, another feeding
a separate research analytics pipeline — mirrors exactly how a
single critical lab result might need to simultaneously trigger an
immediate clinical alert AND get logged for a population health
study, with neither use case blocking or slowing down the other.
    `,

    example: `
# Conceptual walkthrough (Python code arrives tomorrow) —
# today, trace through this scenario by hand:

# Topic "vitals-stream" has 4 partitions: P0, P1, P2, P3

# Consumer Group "realtime-alerts" (3 instances running):
#   Instance 1 -> assigned P0, P1   (handling 2 partitions)
#   Instance 2 -> assigned P2
#   Instance 3 -> assigned P3
# (Kafka balances as evenly as possible, but with 4 partitions and
#  3 instances, one instance gets 2)

# Consumer Group "nightly-aggregator" (1 instance running):
#   Instance 1 -> assigned P0, P1, P2, P3  (all 4, since it's
#                  the only instance in this separate group)

# Both groups read the SAME messages from the SAME topic,
# completely independently, with separate offset tracking.

# Question to answer yourself: if "realtime-alerts" adds a 4th
# instance, what happens to the partition assignment?
# (Answer: each instance gets exactly 1 partition — a perfectly
# even split, since 4 instances now exactly matches 4 partitions.)
    `,

    commonMistakes: [
      "Assuming more consumer instances always means more parallelism — once instance count exceeds partition count within a group, the extra instances sit idle.",
      "Forgetting that different consumer groups reading the same topic are completely independent — they don't 'compete' for messages or affect each other's offsets.",
      "Not choosing a partition key when message ordering for a specific entity (like a patient) actually matters, leaving ordering to chance.",
      "Confusing 'committing an offset' with 'deleting a message' — committing only records a consumer's progress; the message itself remains in Kafka per the retention policy.",
    ],

    exercises: [
      "Draw out a topic with 5 partitions and a consumer group with 2 instances — determine and write down how partitions would be distributed.",
      "Explain, in 2-3 sentences, why two different consumer groups reading the same topic don't interfere with each other.",
      "Describe a real scenario (from any domain) where you'd want to partition messages by a specific key to preserve per-entity ordering.",
      "Complete the Confluent Kafka 101 course's sections on producers, consumers, and consumer groups, taking notes on anything that contradicts your assumptions from Day 1.",
    ],

    resources: [
      {
        objective: "Deepen understanding of producers, consumers, and consumer groups",
        items: [
          { title: "Confluent — Apache Kafka 101 (Free Official Course)", url: "https://developer.confluent.io/courses/apache-kafka/events/", type: "official free course", note: "Continue this course today — complete the producers, consumers, and consumer groups modules fully before moving to Python code tomorrow." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 93 — Writing Python Producers & Consumers
  // ============================================================
  {
    id: "W19D3", week: 19, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-21",
    type: "lesson",
    topic: "Writing Kafka Producers & Consumers in Python with confluent-kafka",
    duration: "2–3 hours",

    objectives: [
      "Install and configure confluent-kafka for a local Kafka instance",
      "Write a Python producer that publishes JSON messages with a partition key",
      "Write a Python consumer that reads messages and commits offsets",
      "Run a local Kafka broker using Docker for hands-on practice",
    ],

    introduction: `
Two days of concepts, now made real. Today you run an actual
Kafka broker locally (via Docker, exactly like Week 9's
PostgreSQL setup) and write genuine Python producer and consumer
code using confluent-kafka — the official, production-grade Python
client library, maintained by Confluent.
    `,

    mentalModel: `
MENTAL MODEL — "Same Docker Pattern as Week 9, Different Service"

Running Kafka locally via Docker follows the exact same pattern as
running PostgreSQL in Week 9 — a disposable, reproducible container
you can start, use, and tear down without installing anything
permanently on your machine. The producer/consumer Python code
you'll write today is structurally similar to the psycopg2 code
from Week 12: connect, send/receive, handle errors, close cleanly.
    `,

    explanation: `
RUNNING KAFKA LOCALLY WITH DOCKER
=======================================
# docker-compose.yml (simplified single-broker setup for learning)
version: "3"
services:
  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      # ... additional required KRaft mode settings ...

docker compose up -d

INSTALLING confluent-kafka
================================
pip install confluent-kafka

WRITING A PRODUCER
=======================
from confluent_kafka import Producer
import json

producer = Producer({"bootstrap.servers": "localhost:9092"})

def delivery_report(err, msg):
    if err is not None:
        print(f"Delivery failed: {err}")
    else:
        print(f"Delivered to {msg.topic()} [partition {msg.partition()}]")

def send_lab_result(patient_id: int, test_name: str, result_value: float):
    payload = json.dumps({
        "patient_id": patient_id,
        "test_name": test_name,
        "result_value": result_value,
    })
    producer.produce(
        topic="lab-results-stream",
        key=str(patient_id),     # partition key — preserves per-patient order
        value=payload,
        callback=delivery_report,
    )
    producer.poll(0)     # triggers delivery callbacks

send_lab_result(42, "Glucose", 105.5)
producer.flush()     # blocks until all pending messages are delivered

WRITING A CONSUMER
=======================
from confluent_kafka import Consumer
import json

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "lab-results-processor",
    "auto.offset.reset": "earliest",     # start from the beginning if no
                                           # committed offset exists yet
})
consumer.subscribe(["lab-results-stream"])

try:
    while True:
        msg = consumer.poll(1.0)     # wait up to 1 second for a message
        if msg is None:
            continue
        if msg.error():
            print(f"Consumer error: {msg.error()}")
            continue

        data = json.loads(msg.value())
        print(f"Received: {data}")
        consumer.commit(msg)
finally:
    consumer.close()     # always close cleanly, even on error/interrupt

auto.offset.reset OPTIONS
==============================
"earliest"  : start from the very beginning of the topic's retained
              history if this consumer group has never committed
              an offset before
"latest"     : start from the most recent message onward, ignoring
              any history — appropriate when only NEW events matter

ERROR HANDLING AND GRACEFUL SHUTDOWN
==========================================
Wrap the consume loop in try/finally to guarantee consumer.close()
runs even if the process is interrupted (e.g. Ctrl+C) — an unclean
shutdown can delay that consumer's partitions being reassigned to
others in the group during a rebalance.
    `,

    clinicalConnection: `
Partitioning lab result messages by patient_id, exactly as shown
in the producer code, guarantees that a single patient's sequence
of results always arrives at a downstream consumer in the correct
chronological order — critical when a trend (Week 10's LAG-based
change detection, now happening in real time) depends on seeing
events in the right sequence.
    `,

    example: `
# producer.py
from confluent_kafka import Producer
import json
import time

producer = Producer({"bootstrap.servers": "localhost:9092"})

def delivery_report(err, msg):
    if err is not None:
        print(f"Delivery failed: {err}")
    else:
        print(f"Delivered: partition={msg.partition()} offset={msg.offset()}")

def send_lab_result(patient_id: int, test_name: str, result_value: float):
    payload = json.dumps({
        "patient_id": patient_id,
        "test_name": test_name,
        "result_value": result_value,
        "timestamp": time.time(),
    })
    producer.produce(
        topic="lab-results-stream",
        key=str(patient_id),
        value=payload,
        callback=delivery_report,
    )
    producer.poll(0)

if __name__ == "__main__":
    sample_results = [
        (42, "Glucose", 105.5),
        (17, "CBC", 7.2),
        (42, "Glucose", 142.0),
    ]
    for patient_id, test_name, value in sample_results:
        send_lab_result(patient_id, test_name, value)
        time.sleep(0.5)
    producer.flush()
    print("All messages sent")


# consumer.py
from confluent_kafka import Consumer
import json

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "lab-results-processor",
    "auto.offset.reset": "earliest",
})
consumer.subscribe(["lab-results-stream"])

print("Listening for lab results... (Ctrl+C to stop)")
try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Error: {msg.error()}")
            continue
        data = json.loads(msg.value())
        print(f"Patient {data['patient_id']}: {data['test_name']} = {data['result_value']}")
        consumer.commit(msg)
except KeyboardInterrupt:
    print("Shutting down consumer...")
finally:
    consumer.close()
    `,

    commonMistakes: [
      "Forgetting producer.flush() at the end of a script, causing the process to exit before pending messages are actually delivered.",
      "Not wrapping the consumer loop in try/finally, leading to an unclean shutdown that delays partition rebalancing for the rest of the group.",
      "Using auto.offset.reset='latest' when historical replay was actually needed (or vice versa), missing or re-processing data unexpectedly.",
      "Forgetting to JSON-encode/decode message payloads consistently between producer and consumer, causing deserialization errors downstream.",
    ],

    exercises: [
      "Set up a local Kafka broker using Docker Compose, and confirm it's running before writing any Python code.",
      "Write a producer script that sends at least 5 sample messages with a meaningful partition key, with delivery callbacks confirming success.",
      "Write a consumer script in a SEPARATE terminal/process that reads those messages in real time as they're produced.",
      "Stop and restart your consumer mid-stream, and confirm (using committed offsets) it resumes from where it left off rather than re-reading everything.",
    ],

    resources: [
      {
        objective: "Learn confluent-kafka's Python API specifically",
        items: [
          { title: "Confluent — Kafka for Python Developers (Free Course)", url: "https://developer.confluent.io/courses/kafka-python/intro/", type: "official free course", note: "Do this today — shows exactly how to write producers and consumers in Python using confluent-kafka." },
        ],
      },
      {
        objective: "Build a real producer/consumer pipeline with GCP context",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 6: Stream Processing (Kafka)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/06-streaming", type: "video + hands-on lab", note: "Your primary hands-on resource for the rest of this week — follow every step precisely, builds toward BigQuery integration." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 94 — Kafka Connect, GCP Pub/Sub & the Streaming Decision Framework
  // ============================================================
  {
    id: "W19D4", week: 19, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-22",
    type: "lesson",
    topic: "Kafka Connect, GCP Pub/Sub & Choosing Between Streaming Platforms",
    duration: "2–3 hours",

    objectives: [
      "Explain what Kafka Connect does and why it reduces custom integration code",
      "Compare GCP Pub/Sub to self-managed Kafka conceptually",
      "Identify when a managed streaming service is preferable to running Kafka yourself",
      "Apply the batch-vs-streaming decision framework to a real pipeline scenario",
    ],

    introduction: `
You've now written Kafka producers and consumers by hand. Today
covers two important extensions: Kafka Connect, which eliminates
the need to hand-write integration code for common sources/sinks,
and GCP Pub/Sub, Google's fully-managed equivalent — directly
relevant since your entire Phase 2 warehouse already lives in GCP.
Today closes the loop on "when do I actually reach for streaming
at all" with a concrete decision framework.
    `,

    mentalModel: `
MENTAL MODEL — "Pre-Built Adapters vs Wiring Custom Cables"

Writing a custom producer/consumer for every single data movement
need is like hand-wiring a custom cable every time you want to
connect two devices. Kafka Connect is a drawer full of standard,
pre-built adapters (a PostgreSQL connector, a BigQuery connector)
— for COMMON integration patterns, you configure an existing
connector instead of writing custom code. GCP Pub/Sub is choosing
to rent a fully serviced facility instead of building and
maintaining your own — less control, dramatically less operational
burden.
    `,

    explanation: `
KAFKA CONNECT — CONFIGURATION INSTEAD OF CUSTOM CODE
==========================================================
Kafka Connect runs SOURCE connectors (pulling data INTO Kafka from
external systems) and SINK connectors (pushing data FROM Kafka
INTO external systems), configured via JSON rather than hand-
written producer/consumer code:

{
  "name": "postgres-source-connector",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/hospital_practice",
    "table.whitelist": "lab_results",
    "mode": "incrementing",
    "incrementing.column.name": "result_id",
    "topic.prefix": "postgres-"
  }
}

This automatically streams new rows from your Week 9 PostgreSQL
lab_results table into a Kafka topic as they're inserted — Change
Data Capture (CDC), without writing a single line of custom
producer code. A BigQuery SINK connector could then stream that
same data onward into your Week 16 warehouse automatically.

GCP PUB/SUB — GOOGLE'S MANAGED EQUIVALENT
================================================
from google.cloud import pubsub_v1

publisher = publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path("victoros-hospital-de", "lab-results")

def publish_result(patient_id: int, test_name: str, result_value: float):
    import json
    data = json.dumps({"patient_id": patient_id, "test_name": test_name,
                         "result_value": result_value}).encode("utf-8")
    future = publisher.publish(topic_path, data)
    print(future.result())

Pub/Sub's core concepts map closely to Kafka's: topics, subscriptions
(roughly equivalent to consumer groups), and message ordering keys
— but Google handles all broker management, scaling, and replication
for you, with no servers to provision or patch.

KAFKA vs PUB/SUB — WHEN TO CHOOSE WHICH
=============================================
Self-managed Kafka : more control over partitioning, retention,
                      and performance tuning; the industry-standard
                      skill most job postings explicitly name;
                      more operational overhead
GCP Pub/Sub          : fully managed, scales automatically, tightly
                      integrated with the rest of your GCP stack
                      (Week 15-16); less fine-grained control;
                      genuinely simpler to operate for many use cases

Many real teams use BOTH — Kafka for complex internal event
streaming with custom partitioning needs, Pub/Sub for simpler
GCP-native integrations, especially when a team is already
GCP-centric (as your entire Phase 2 stack has been).

THE STREAMING vs BATCH DECISION FRAMEWORK — APPLIED
=========================================================
Revisit Day 1's framework with a concrete worked example:

Scenario: "Alert a physician within 1 minute if a patient's heart
rate exceeds 150 bpm."
-> STREAMING is clearly required — a daily batch job checking
   yesterday's heart rate data is operationally useless for this
   requirement; the value of the information decays to zero within
   minutes.

Scenario: "Generate a weekly report of average prescriptions per
department."
-> BATCH is clearly sufficient and simpler — there's no value lost
   by waiting until the scheduled weekly run; introducing streaming
   here would add real complexity for no actual benefit.

Most real systems are NOT all-streaming or all-batch — they're a
deliberate MIX, with streaming reserved for the specific use cases
that genuinely need low latency.
    `,

    clinicalConnection: `
A vitals-monitoring alert needing to reach a physician within
seconds versus a weekly departmental prescription report needing
no faster than weekly is exactly the worked decision-framework
example — and it's not hypothetical; real hospital systems make
precisely this kind of architectural choice for every new
monitoring or reporting requirement they build.
    `,

    example: `
# Kafka Connect source connector config (CDC from PostgreSQL)
{
  "name": "postgres-lab-results-source",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/hospital_practice",
    "connection.user": "victor",
    "table.whitelist": "lab_results",
    "mode": "incrementing",
    "incrementing.column.name": "result_id",
    "topic.prefix": "postgres-",
    "poll.interval.ms": "5000"
  }
}

# GCP Pub/Sub publisher equivalent of yesterday's Kafka producer
from google.cloud import pubsub_v1
import json

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path("victoros-hospital-de", "lab-results")

def publish_result(patient_id: int, test_name: str, result_value: float):
    data = json.dumps({
        "patient_id": patient_id,
        "test_name": test_name,
        "result_value": result_value,
    }).encode("utf-8")
    future = publisher.publish(topic_path, data, ordering_key=str(patient_id))
    print(f"Published message ID: {future.result()}")

publish_result(42, "Glucose", 118.0)
    `,

    commonMistakes: [
      "Writing custom producer code for a standard integration pattern (e.g. streaming a PostgreSQL table's changes) that a pre-built Kafka Connect connector already handles.",
      "Choosing self-managed Kafka by default without considering whether a managed service like Pub/Sub would meet the same need with far less operational burden.",
      "Defaulting to streaming for a requirement that batch would handle perfectly well, adding unjustified complexity.",
      "Forgetting Pub/Sub's ordering_key parameter when message order for a specific entity matters, the direct equivalent of Kafka's partition key.",
    ],

    exercises: [
      "Find and read the configuration reference for one Kafka Connect connector type relevant to your stack (e.g. a JDBC source or BigQuery sink connector).",
      "Write a small Python script using google-cloud-pubsub to publish a message, comparing the API shape directly against yesterday's confluent-kafka producer.",
      "Apply the decision framework to 3 scenarios of your own choosing (not from this lesson) and justify streaming vs batch for each in 1-2 sentences.",
      "Write 2-3 sentences explaining when you'd choose GCP Pub/Sub over self-managed Kafka for a real project, given your specific GCP-centric Phase 2 stack.",
    ],

    resources: [
      {
        objective: "Understand Kafka Connect and integration patterns",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 6: Stream Processing (Kafka)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/06-streaming", type: "video + hands-on lab", note: "Continue this module — covers Kafka Connect and GCP integration directly." },
          { title: "DataCamp — Kafka Streams Tutorial", url: "https://www.datacamp.com/tutorial/kafka-streams-tutorial", type: "article", note: "Good supplement for understanding stream processing patterns beyond basic producers/consumers." },
        ],
      },
      {
        objective: "Learn GCP Pub/Sub as a managed alternative",
        items: [
          { title: "Google Cloud — Pub/Sub Documentation", url: "https://cloud.google.com/pubsub/docs", type: "reference", note: "Official reference for topics, subscriptions, and the Python client library." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 95 — Week 19 Project: Kafka Producer/Consumer Demo
  // ============================================================
  {
    id: "W19D5", week: 19, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-23",
    type: "project",
    topic: "Project: Kafka Producer/Consumer Demo",
    duration: "3–4 hours",

    objectives: [
      "Build a complete, working Kafka producer/consumer pair simulating a real event stream",
      "Apply correct partition key selection for meaningful ordering guarantees",
      "Demonstrate consumer group behaviour with multiple consumer instances",
      "Produce a documented, portfolio-ready streaming demo",
    ],

    introduction: `
This week's project converts a piece of your existing Week 13
batch pipeline into a simulated real-time stream — directly
demonstrating the batch-to-streaming transformation pattern from
Day 4's Stephane Maarek reading. This is a genuinely distinctive
portfolio piece, since most beginner data engineering portfolios
stop at batch ETL and never touch streaming at all.
    `,

    mentalModel: `
MENTAL MODEL — "Converting the Morning Rounds Report Into a Live Monitor Feed"

This project is the architectural equivalent of taking a once-
daily rounds summary report and turning it into a live, continuously
updating monitor feed instead — same underlying information, but
restructured for instant reaction rather than scheduled review.
Demonstrating you can make that conversion deliberately, understanding
exactly what changes and why, is the actual skill being assessed.
    `,

    explanation: `
PROJECT BRIEF
================
Build "Hospital Vitals Stream Demo" with these components:

1. SIMULATED EVENT SOURCE
   - A producer script that simulates a continuous stream of
     patient vitals/lab events (synthetic data is fine — reuse
     numpy random generation patterns from Week 7)
   - Send at least 50 messages, partitioned by patient_id, with a
     short delay between sends to simulate real-time arrival

2. CONSUMER — REAL-TIME PROCESSING
   - A consumer script that reads the stream and performs at least
     one meaningful real-time action per message: flagging an
     out-of-range value (reusing Week 11's CASE WHEN-style
     thresholds, now applied per-message instead of per-row in SQL)

3. CONSUMER GROUP DEMONSTRATION
   - Run at least 2 instances of your consumer simultaneously under
     the same group_id, and document (with terminal output/
     screenshots) how Kafka splits partition assignment between them
   - Stop one instance mid-stream and confirm (and document) that
     its partitions get reassigned to the remaining instance

4. OFFSET RESUMPTION PROOF
   - Stop your consumer entirely, restart it, and confirm (via
     committed offsets) that it resumes from where it left off
     rather than re-processing or skipping messages

5. BATCH-TO-STREAMING REFLECTION
   - A written comparison: what would this same logic have looked
     like as a Week 13 batch pipeline, and what specifically changes
     by making it streaming (latency, architecture, complexity
     tradeoffs)

DELIVERABLE
==============
1. producer.py and consumer.py, fully working
2. Terminal output/screenshots demonstrating consumer group
   rebalancing and offset resumption
3. REFLECTION.md: the batch-vs-streaming comparison
4. README.md: setup instructions (including the Docker Kafka
   broker), what the demo does, and how to run it
5. Push to GitHub
    `,

    clinicalConnection: `
A continuous vitals stream automatically flagging an out-of-range
heart rate the instant it's published — rather than waiting for a
scheduled batch report to catch it hours later — is exactly the
kind of real-time clinical monitoring capability streaming
architecture enables, and precisely the use case that justifies
the added complexity over a simpler batch approach.
    `,

    example: `
# producer.py — simulating a continuous vitals stream
from confluent_kafka import Producer
import json
import time
import random

producer = Producer({"bootstrap.servers": "localhost:9092"})

def delivery_report(err, msg):
    if err is not None:
        print(f"Delivery failed: {err}")

def simulate_vitals_stream(num_messages: int = 50):
    patient_ids = [12, 27, 35, 48, 51]
    for _ in range(num_messages):
        patient_id = random.choice(patient_ids)
        heart_rate = round(random.gauss(80, 15), 1)
        payload = json.dumps({
            "patient_id": patient_id,
            "heart_rate": heart_rate,
            "timestamp": time.time(),
        })
        producer.produce(
            topic="vitals-stream",
            key=str(patient_id),
            value=payload,
            callback=delivery_report,
        )
        producer.poll(0)
        time.sleep(0.3)
    producer.flush()
    print(f"Sent {num_messages} simulated vitals events")

if __name__ == "__main__":
    simulate_vitals_stream(50)


# consumer.py — real-time threshold flagging
from confluent_kafka import Consumer
import json

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "vitals-monitor-group",
    "auto.offset.reset": "earliest",
})
consumer.subscribe(["vitals-stream"])

HEART_RATE_HIGH = 120
HEART_RATE_LOW = 50

print("Monitoring vitals stream... (Ctrl+C to stop)")
try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"Error: {msg.error()}")
            continue

        data = json.loads(msg.value())
        hr = data["heart_rate"]
        flag = ""
        if hr > HEART_RATE_HIGH:
            flag = " *** TACHYCARDIA ALERT ***"
        elif hr < HEART_RATE_LOW:
            flag = " *** BRADYCARDIA ALERT ***"
        print(f"Patient {data['patient_id']}: HR={hr}{flag}")
        consumer.commit(msg)
except KeyboardInterrupt:
    print("Shutting down...")
finally:
    consumer.close()
    `,

    commonMistakes: [
      "Running only one consumer instance, missing the chance to actually demonstrate the consumer group partition-splitting behaviour the brief specifically requires.",
      "Skipping the offset resumption proof and merely asserting it works without showing actual evidence (committed offset values, terminal output before/after restart).",
      "Writing the batch-vs-streaming reflection generically instead of grounding it in the SPECIFIC logic this project implements.",
      "Forgetting a partition key entirely, losing the per-patient ordering guarantee the project's own threshold-flagging logic implicitly depends on.",
    ],

    exercises: [
      "Build the complete producer and consumer scripts per the brief, and confirm they work end to end against your local Kafka broker.",
      "Run 2 consumer instances under the same group_id simultaneously, document partition assignment, then stop one and document the rebalance.",
      "Stop and restart your consumer, and capture evidence (offset values or message sequence) proving correct resumption.",
      "Write REFLECTION.md comparing this project's logic as batch vs streaming, then push the complete project to GitHub.",
    ],

    resources: [
      {
        objective: "Reference the complete producer/consumer pattern",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 6: Stream Processing (Kafka)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/06-streaming", type: "video + hands-on lab", note: "Your primary structural reference — follow its producer/consumer pipeline pattern closely." },
        ],
      },
      {
        objective: "Understand the batch-to-streaming conversion pattern for the reflection",
        items: [
          { title: "Medium — How to Use Kafka to Transform a Batch Pipeline into Real-Time", url: "https://medium.com/@stephane.maarek/how-to-use-apache-kafka-to-transform-a-batch-pipeline-into-a-real-time-one-831b48a6ad85", type: "article", note: "By Stephane Maarek, a leading Kafka educator — read this before writing REFLECTION.md, directly relevant to this project's core comparison." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK19 };
}
